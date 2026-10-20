# -*- coding: utf-8 -*-
"""「大畅」定制字标 v2 —— 从笔画手工构建：统一笔宽几何笔画 + 方形收笔 + 微斜"""
import math
from PIL import Image, ImageDraw

S = 3  # 超采样倍数
W, H = 1150, 560
img = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

SW = 32   # 主笔宽
SW2 = 28  # 次笔宽
SW3 = 17  # 点画笔宽

def stroke(x1, y1, x2, y2, w):
    """旋转矩形笔画，平头收笔"""
    x1, y1, x2, y2, w = [v * S for v in (x1, y1, x2, y2, w)]
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy)
    ux, uy = dx / L, dy / L          # 沿笔画方向
    px, py = -uy, ux                 # 垂直方向
    hw = w / 2
    pts = [
        (x1 + px * hw, y1 + py * hw),
        (x2 + px * hw, y2 + py * hw),
        (x2 - px * hw, y2 - py * hw),
        (x1 - px * hw, y1 - py * hw),
    ]
    d.polygon(pts, fill=(255, 255, 255, 255))

# ============ 大 ============
# 横（舒展，两端出头）
stroke(60, 190, 420, 190, SW)
# 撇（穿过横，向上出头）
stroke(250, 105, 80, 470, SW)
# 捺（自横下起，向右下伸展，略长）
stroke(258, 195, 448, 450, SW)

# ============ 畅（ox = 左偏移）============
ox = 560
# —— 左：申 ——
# 外框
stroke(ox + 40, 100, ox + 40, 290, SW2)      # 左竖
stroke(ox + 190, 100, ox + 190, 290, SW2)    # 右竖
stroke(ox + 40, 100, ox + 190, 100, SW2)     # 上横
stroke(ox + 40, 290, ox + 190, 290, SW2)     # 下横
# 中横（出头）
stroke(ox + 18, 195, ox + 212, 195, SW2)
# 中竖（短出头）
stroke(ox + 115, 60, ox + 115, 335, SW2)

# —— 右：日（上）——
stroke(ox + 270, 45, ox + 270, 215, SW2)     # 左竖
stroke(ox + 440, 45, ox + 440, 215, SW2)     # 右竖
stroke(ox + 270, 45, ox + 440, 45, SW2)      # 上横
stroke(ox + 270, 130, ox + 440, 130, SW2)    # 中横
stroke(ox + 270, 215, ox + 440, 215, SW2)    # 下横

# —— 右：勿（下）——
# 长撇（穿横）
stroke(ox + 405, 245, ox + 270, 465, SW2)
# 横折钩：横
stroke(ox + 260, 295, ox + 455, 295, SW2)
# 横折钩：折（近竖）
stroke(ox + 455, 295, ox + 425, 470, SW2)
# 横折钩：挑钩（向左上）
stroke(ox + 425, 470, ox + 393, 438, SW2)
# 内两点
stroke(ox + 352, 332, ox + 320, 400, SW3)
stroke(ox + 404, 332, ox + 372, 400, SW3)

# ============ 整体微斜（x' = x + k*y）============
k = 0.06
new_w = int(W + k * H)
img = img.transform((new_w * S, H * S), Image.AFFINE, (1, -k, k * H * S, 0, 1, 0),
                    resample=Image.BICUBIC)
img = img.resize((new_w, H), Image.LANCZOS)

# 裁边
import numpy as np
a = np.array(img)[:, :, 3]
ys, xs = np.where(a > 8)
img = img.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

out = r"C:\Users\Dachang\Desktop\作品集网站\working files\decks\portfolio_frame-9759a832\media\name-logo.png"
img.save(out)
print("saved:", img.size, "aspect:", round(img.width / img.height, 3))
