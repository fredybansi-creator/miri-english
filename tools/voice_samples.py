"""Render a few Kokoro voice samples to compare (writes samples/kokoro-*.mp3)."""
import pathlib
import numpy as np
import lameenc
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODELS = ROOT / "tools" / "models"
OUT = ROOT / "samples"
OUT.mkdir(exist_ok=True)

TEXT = "Oh my god, hi! It's been ages! What have you been up to? I started a new job two months ago."
VOICES = [("af_heart", "en-us"), ("af_bella", "en-us"), ("am_michael", "en-us"), ("am_puck", "en-us"),
          ("bf_emma", "en-gb"), ("bm_george", "en-gb")]


def mp3(samples, rate):
    pcm = (np.clip(samples, -1, 1) * 32767).astype(np.int16).tobytes()
    enc = lameenc.Encoder()
    enc.set_bit_rate(48)
    enc.set_in_sample_rate(rate)
    enc.set_channels(1)
    enc.set_quality(2)
    return enc.encode(pcm) + enc.flush()


kokoro = Kokoro(str(MODELS / "kokoro-v1.0.onnx"), str(MODELS / "voices-v1.0.bin"))
for voice, lang in VOICES:
    samples, rate = kokoro.create(TEXT, voice=voice, speed=1.0, lang=lang)
    (OUT / f"kokoro-{voice}.mp3").write_bytes(mp3(samples, rate))
    print(voice, round(len(samples) / rate, 1), "s")
