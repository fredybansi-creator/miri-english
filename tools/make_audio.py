"""Generate natural audio for every fixed English sentence in the app with Kokoro (free, offline).

Usage (from the project folder):
    tools/.venv/Scripts/python tools/make_audio.py

Writes audio/<voice-set>/<key>.mp3 plus audio/manifest.json. Existing files are skipped, so after
adding new lessons just run it again. The app (js/speech.js) computes the same key from the text.

Setup once:  python -m venv tools/.venv
             tools/.venv/Scripts/python -m pip install kokoro-onnx soundfile lameenc json5
             model files from https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0)
             → tools/models/kokoro-v1.0.onnx and tools/models/voices-v1.0.bin
"""
import json
import pathlib
import re
import sys
import time

import json5
import lameenc
import numpy as np
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
AUDIO = ROOT / "audio"
MODELS = ROOT / "tools" / "models"

# voice sets the app can ask for: <accent>-<role>
VOICES = {
    "us-main": ("af_heart", "en-us"),
    "us-friend": ("am_michael", "en-us"),
    "uk-main": ("bf_emma", "en-gb"),
    "uk-friend": ("bm_george", "en-gb"),
}

# fixed sentences outside the lessons (settings, voice picker)
EXTRA_MAIN = [
    "This is how fast I will speak.",
    "Hello Miri! This is how I sound.",
    "Great, I will use this voice.",
    "Hi Miri! It's been ages – what have you been up to?",
]


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def key(text: str) -> str:
    """FNV-1a (32 bit) over Unicode code points + length. Must match audioKey() in js/speech.js."""
    t = normalize(text)
    h = 0x811C9DC5
    for ch in t:
        h ^= ord(ch)
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}{len(t):x}"


def load_module(path: pathlib.Path):
    src = path.read_text(encoding="utf-8")
    body = src[src.index("export default") + len("export default"):].strip().rstrip(";")
    return json5.loads(body)


def is_english(s: str) -> bool:
    return bool(re.match(r"^[A-Za-z“\"'(]", s or ""))


def collect():
    main, friend = set(EXTRA_MAIN), set()
    for f in sorted(CONTENT.glob("m*.js")):
        mod = load_module(f)
        for l in mod["lessons"]:
            for p in l["phrases"]:
                main.add(p["en"]); p.get("ex") and main.add(p["ex"])
            for w in l.get("words", []):
                main.add(w["en"]); w.get("ex") and main.add(w["ex"])
            for x in l["tip"].get("examples", []):
                main.add(x["good"])
            for s in l["speak"]:
                friend.add(s["they"]); main.add(s["answers"][0]); s.get("levelUp") and main.add(s["levelUp"])
            if l.get("free"):
                friend.add(l["free"]["they"]); main.add(l["free"]["sample"])
            for e in l["exercises"]:
                t = e["type"]
                if t in ("listen", "listenbuild", "shadow"):
                    main.add(e["en"])
                elif t == "build":
                    main.add(e["answer"])
                elif t == "fix":
                    main.add(e["correct"])
                elif t == "gap":
                    a, b = e["sentence"].split("___")
                    main.add(a + e["options"][e["answer"]] + b)
                elif t == "choice" and is_english(e["options"][e["answer"]]):
                    main.add(e["options"][e["answer"]])
                elif t == "match":
                    for en, _ in e["pairs"]:
                        main.add(en)
    clean = lambda xs: sorted({normalize(x) for x in xs if x and normalize(x)})
    return {"main": clean(main), "friend": clean(friend)}


def to_mp3(samples, rate) -> bytes:
    pcm = (np.clip(samples, -1, 1) * 32767).astype(np.int16).tobytes()
    enc = lameenc.Encoder()
    enc.set_bit_rate(48)
    enc.set_in_sample_rate(rate)
    enc.set_channels(1)
    enc.set_quality(2)
    return enc.encode(pcm) + enc.flush()


def main():
    texts = collect()
    print(f"{len(texts['main'])} sentences (main) + {len(texts['friend'])} (friend)")
    kokoro = Kokoro(str(MODELS / "kokoro-v1.0.onnx"), str(MODELS / "voices-v1.0.bin"))
    manifest = {"version": 1, "voices": {k: v[0] for k, v in VOICES.items()}, "keys": {}}
    started = time.time()
    made = 0
    for vset, (voice, lang) in VOICES.items():
        role = vset.split("-")[1]
        folder = AUDIO / vset
        folder.mkdir(parents=True, exist_ok=True)
        keys = []
        for i, text in enumerate(texts[role]):
            k = key(text)
            out = folder / f"{k}.mp3"
            if not out.exists():
                try:
                    samples, rate = kokoro.create(text, voice=voice, speed=1.0, lang=lang)
                    out.write_bytes(to_mp3(samples, rate))
                    made += 1
                except Exception as e:  # keep going – the app falls back to the device voice
                    print("  failed:", vset, text[:50], e)
                    continue
            keys.append(k)
            if (i + 1) % 100 == 0:
                print(f"  {vset}: {i + 1}/{len(texts[role])}  ({time.time() - started:.0f}s)")
        manifest["keys"][vset] = sorted(keys)
        print(f"{vset}: {len(keys)} files")
    (AUDIO / "manifest.json").write_text(json.dumps(manifest, separators=(",", ":")), encoding="utf-8")
    print(f"done – {made} new files in {time.time() - started:.0f}s")


if __name__ == "__main__":
    sys.exit(main())
