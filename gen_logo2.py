# -*- coding: utf-8 -*-
"""「大畅」定制字标 v4 —— 手工笔画构建：统一字高基线 + 勿作两撇（一出头一含内）"""
import math
import numpy as np
from PIL import Image, ImageDraw

S = 3  # 超采样倍数
W, H = 1150, 560

SW = 32   # 主笔宽
SW2 = 28  # 次笔宽
SW3 = 17  # 点画笔宽

def stroke(d, x1, y1, x2, y2, w):
    """旋转矩形笔画，平头收笔（坐标为基准单位，内部乘超采样倍数）"""
    x1, y1, x2, y2, w = [v * S for v in (x1, y1, x2, y2, w)]
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy)
    ux, uy = dx / L, dy / L
    px, py = -uy, ux
    hw = w / 2
    pts = [
        (x1 + px * hw, y1 + py * hw),
        (x2 + px * hw, y2 + py * hw),
        (x2 - px * hw, y2 - py * hw),
        (x1 - px * hw, y1 - py * hw),
    ]
    d.polygon(pts, fill=(255, 255, 255, 255))

def new_layer():
    img = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    return img, ImageDraw.Draw(img)

def crop_bbox(img):
    a = np.array(img)[:, :, 3]
    ys, xs = np.where(a > 8)
    return img.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

# ============ 大 ============
imgA, dA = new_layer()
stroke(dA, 60, 190, 420, 190, SW)      # 横
stroke(dA, 250, 105, 80, 470, SW)      # 撇
stroke(dA, 258, 195, 448, 450, SW)     # 捺
A = crop_bbox(imgA)

# ============ 畅 ============
imgB, dB = new_layer()
ox = 0
# —— 左：申 ——
stroke(dB, ox + 40, 100, ox + 40, 290, SW2)      # 左竖
stroke(dB, ox + 190, 100, ox + 190, 290, SW2)    # 右竖
stroke(dB, ox + 40, 100, ox + 190, 100, SW2)     # 上横
stroke(dB, ox + 40, 290, ox + 190, 290, SW2)     # 下横
stroke(dB, ox + 18, 195, ox + 212, 195, SW2)     # 中横（出头）
stroke(dB, ox + 115, 35, ox + 115, 450, SW2)     # 中竖（贯穿）
# —— 右上：日 ——
stroke(dB, ox + 270, 45, ox + 270, 215, SW2)
stroke(dB, ox + 440, 45, ox + 440, 215, SW2)
stroke(dB, ox + 270, 45, ox + 440, 45, SW2)
stroke(dB, ox + 270, 130, ox + 440, 130, SW2)
stroke(dB, ox + 270, 215, ox + 440, 215, SW2)
# —— 右下：勿（两撇：一微出头、一含内）——
stroke(dB, ox + 260, 295, ox + 455, 295, SW2)    # 横
stroke(dB, ox + 455, 295, ox + 425, 470, SW2)    # 折
stroke(dB, ox + 425, 470, ox + 399, 447, SW2)    # 挑钩
stroke(dB, ox + 405, 245, ox + 270, 465, SW2)    # 撇①：长穿越撇（参考上一版）
stroke(dB, ox + 400, 312, ox + 355, 455, SW3)    # 撇②：含内不出头
B = crop_bbox(imgB)

# ============ 统一字高与基线 ============
TARGET_H = A.height                       # 以「大」的字高为准
B2 = B.resize((round(B.width * TARGET_H / B.height), TARGET_H), Image.LANCZOS)
GAP = 90 * S                              # 两字间距
canvas_w = A.width + GAP + B2.width
canvas_h = max(A.height, B2.height)
combo = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
combo.alpha_composite(A, (0, canvas_h - A.height))
combo.alpha_composite(B2, (A.width + GAP, canvas_h - B2.height))

# ============ 整体微斜（x' = x + k*y）============
k = 0.06
new_w = int(canvas_w / S + k * canvas_h / S)
combo_big = combo.transform((new_w * S, canvas_h), Image.AFFINE,
                            (1, -k, k * canvas_h, 0, 1, 0), resample=Image.BICUBIC)
combo_big = combo_big.resize((new_w, canvas_h // S), Image.LANCZOS)
img = crop_bbox(combo_big)

out = r"C:\Users\Dachang\Desktop\作品集网站\working files\decks\portfolio_frame-9759a832\media\name-logo.png"
img.save(out)
print("saved:", img.size, "aspect:", round(img.width / img.height, 3))
