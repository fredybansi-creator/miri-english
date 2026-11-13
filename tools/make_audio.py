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
import gc
import json
import os
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
MODELS = pathlib.Path(os.environ.get("KOKORO_MODELS") or ROOT / "tools" / "models")
NEW_CONTENT = ROOT / "neu" / "content"  # the new daily-practice app (rebuild 2026-11)

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
    # Raluca in the new app (neu/app.js, RALUCA_LINES)
    "Hi Miri! Ready for today?",
    "Great job!",
    "Well done!",
    "Let's try again.",
    "You did it! See you tomorrow!",
    # the game (neu/game.js MOOD_LINE, neu/app.js)
    "I love you, Miri!",
    "I'm hungry, Miri!",
    "I missed you, Miri!",
    "Good girl!",
    "Thank you, Miri! I love it!",
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
    # new app: neu/content/*.js (repeat / build / say / story)
    for f in sorted(NEW_CONTENT.glob("*.js")):
        mod = load_module(f)
        for l in mod["lessons"]:
            for r in l.get("repeat", []):
                main.add(r["en"])
            for b in l.get("build", []):
                main.add(b["en"])
            for s in l.get("say", []):
                s.get("they") and friend.add(s["they"])
                main.add(s["answers"][0])
            st = l.get("story")
            if st:
                main.update(st["lines"])
                for q in st.get("questions", []):
                    main.add(q["q"])
    # the fox game: what the animal friends say (neu/welt/friends.js)
    fr = load_module(ROOT / "neu" / "welt" / "friends.js")
    for f in fr["friends"]:
        for st in f["steps"]:
            main.add(st["say"]["en"])
            if st.get("thanks"):
                main.add(st["thanks"]["en"])
            for a in st.get("answers", []):
                main.add(a)
        for c in f.get("chat", []):
            main.add(c["en"])
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
                    data = to_mp3(samples, rate)
                    del samples
                    for attempt in range(5):  # Windows sometimes reports WinError 1450 (no resources)
                        try:
                            out.write_bytes(data)
                            break
                        except OSError:
                            if attempt == 4:
                                raise
                            gc.collect()
                            time.sleep(2 * (attempt + 1))
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
