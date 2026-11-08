"""Render the app icon as PNG files without external libraries.

Usage: python tools/make_icons.py   (writes icons/*.png)
The shape mirrors icons/icon.svg: teal square, white speech bubble, three dots.
"""
import math
import os
import struct
import zlib

TEAL = (14, 124, 107)
WHITE = (255, 255, 255)
ORANGE = (240, 138, 75)
OUT = os.path.join(os.path.dirname(__file__), "..", "icons")


def inside_bubble(x, y):
    # coordinates in 512-space
    # ellipse body
    if ((x - 256) / 170) ** 2 + ((y - 248) / 136) ** 2 <= 1:
        return True
    # tail: triangle (150,330) (136,412) (220,370)
    def sign(p1, p2, p3):
        return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
    a, b, c = (140, 320), (136, 412), (230, 362)
    d1, d2, d3 = sign((x, y), a, b), sign((x, y), b, c), sign((x, y), c, a)
    neg = d1 < 0 or d2 < 0 or d3 < 0
    pos = d1 > 0 or d2 > 0 or d3 > 0
    return not (neg and pos)


def color_at(x, y, rounded):
    if rounded:
        r = 112
        cx = min(max(x, r), 512 - r)
        cy = min(max(y, r), 512 - r)
        if (x - cx) ** 2 + (y - cy) ** 2 > r * r:
            return None
    for i, cx in enumerate((186, 256, 326)):
        if (x - cx) ** 2 + (y - 248) ** 2 <= 22 * 22:
            return ORANGE if i == 0 else TEAL
    if inside_bubble(x, y):
        return WHITE
    return TEAL


def render(size, rounded, ss=3):
    rows = []
    scale = 512 / size
    for py in range(size):
        row = bytearray([0])
        for px in range(size):
            acc = [0, 0, 0, 0]
            for sy in range(ss):
                for sx in range(ss):
                    x = (px + (sx + 0.5) / ss) * scale
                    y = (py + (sy + 0.5) / ss) * scale
                    c = color_at(x, y, rounded)
                    if c:
                        acc[0] += c[0]; acc[1] += c[1]; acc[2] += c[2]; acc[3] += 255
            n = ss * ss
            a = acc[3] / n
            if a:
                row += bytes([round(acc[0] / (acc[3] / 255)), round(acc[1] / (acc[3] / 255)),
                              round(acc[2] / (acc[3] / 255)), round(a)])
            else:
                row += bytes([0, 0, 0, 0])
        rows.append(bytes(row))
    return b"".join(rows)


def write_png(path, size, data):
    def chunk(tag, payload):
        c = struct.pack(">I", len(payload)) + tag + payload
        return c + struct.pack(">I", zlib.crc32(tag + payload) & 0xFFFFFFFF)
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(data, 9)) + chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(png)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    # iOS rounds the corners itself, so the touch icon is full-bleed
    write_png(os.path.join(OUT, "apple-touch-icon.png"), 180, render(180, rounded=False))
    write_png(os.path.join(OUT, "icon-192.png"), 192, render(192, rounded=False))
    write_png(os.path.join(OUT, "icon-512.png"), 512, render(512, rounded=False, ss=2))
    print("icons written")
