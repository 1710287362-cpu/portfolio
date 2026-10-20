# -*- coding: utf-8 -*-
"""定制「大畅」字标：超粗无衬线 + 紧排 + 微斜 + 帧切线"""
import io
import numpy as np
from PIL import Image
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties

FONT = r"C:\Users\Dachang\AppData\Roaming\kimi-desktop\daimon-share\daimon\runtime\python\fonts\NotoSansSC-Bold.ttf"

# 1) 高分辨率渲染「大畅」
fig = plt.figure(figsize=(8, 4), dpi=400)
ax = fig.add_axes([0, 0, 1, 1])
ax.axis("off")
fp = FontProperties(fname=FONT, size=260)
ax.text(0.5, 0.5, "大畅", fontproperties=fp, color="white",
        ha="center", va="center")
buf = io.BytesIO()
fig.savefig(buf, format="png", transparent=True)
plt.close(fig)
buf.seek(0)
im = Image.open(buf).convert("RGBA")

# 2) 裁到字形包围盒
a = np.array(im)[:, :, 3]
ys, xs = np.where(a > 8)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
im = im.crop((x0, y0, x1 + 1, y1 + 1))
w, h = im.size
print("crop:", w, h)

# 3) 微斜（x' = x + k*y）
k = 0.06
new_w = int(w + k * h)
im2 = im.transform((new_w, h), Image.AFFINE, (1, -k, k * h, 0, 1, 0), resample=Image.BICUBIC)
w, h = im2.size

# 4) 帧切线：在 56% 高度切一条细缝，下半部分右移 2% 宽
slice_y0 = int(h * 0.555)
slice_y1 = int(h * 0.555) + max(3, int(h * 0.012))
shift = int(w * 0.02)
canvas = Image.new("RGBA", (w + shift, h), (0, 0, 0, 0))
top = im2.crop((0, 0, w, slice_y0))
bot = im2.crop((0, slice_y1, w, h))
canvas.paste(top, (0, 0), top)
canvas.paste(bot, (shift, slice_y1), bot)

# 5) 缝内金色细线（细到 1px，先放大画再缩回）
scale = 3
big = canvas.resize((canvas.width * scale, canvas.height * scale), Image.LANCZOS)
d = Image.new("RGBA", big.size, (0, 0, 0, 0))
from PIL import ImageDraw
dr = ImageDraw.Draw(d)
gap_h = (slice_y1 - slice_y0) * scale
dr.rectangle([0, slice_y0 * scale + gap_h // 2, big.width, slice_y0 * scale + gap_h // 2 + scale],
             fill=(232, 163, 61, 255))
big = Image.alpha_composite(big, d)
logo = big.resize((canvas.width, canvas.height), Image.LANCZOS)

# 6) 保存
out = r"C:\Users\Dachang\Desktop\作品集网站\working files\decks\portfolio_frame-9759a832\media\name-logo.png"
logo.save(out)
print("saved:", out, logo.size, "aspect:", round(logo.width / logo.height, 3))
