# -*- coding: utf-8 -*-
"""合成作品集 PDF：横版框架页（封面/简历/封底）+ 竖版项目页 22 页，共 25 页"""
from PIL import Image
import os

SRC = r"C:\Users\Dachang\Desktop\作品集pdf"
FRAME = r"C:\Users\Dachang\Desktop\作品集网站\portfolio_frame\shots"
OUT = r"C:\Users\Dachang\Desktop\作品集网站\大畅-作品集-2026.pdf"

PW, PH = 1080, 1920   # 竖版项目页
LW, LH = 1920, 1080   # 横版框架页

def load(path, size):
    im = Image.open(path).convert("RGB")
    if im.size != size:
        im = im.resize(size, Image.LANCZOS)
    return im

# (图片, PDF页面尺寸pt)；pt = px/2 → 均为 144dpi
pages = [
    (load(os.path.join(FRAME, "page-1.png"), (LW, LH)), (960, 540)),   # 01 封面（横）
    (load(os.path.join(FRAME, "page-2.png"), (LW, LH)), (960, 540)),   # 02 简历（横）
]
# 项目页：01-04 项目（1-12）→ 枫泾古镇新版四页 → 06 美团（19-22）
project_imgs = [os.path.join(SRC, f"{i}.png") for i in range(1, 13)]
project_imgs += [rf"C:\Users\Dachang\Desktop\枫泾古镇宣传网页\pdf\{i}.png" for i in range(1, 5)]
project_imgs += [os.path.join(SRC, f"{i}.png") for i in range(19, 23)]
for p in project_imgs:
    pages.append((load(p, (PW, PH)), (540, 960)))
pages.append((load(os.path.join(FRAME, "page-3.png"), (LW, LH)), (960, 540)))   # 封底（横）

from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
import io

c = canvas.Canvas(OUT)
for im, (pw, ph) in pages:
    c.setPageSize((pw, ph))
    buf = io.BytesIO()
    im.save(buf, format="JPEG", quality=88)
    buf.seek(0)
    c.drawImage(ImageReader(buf), 0, 0, width=pw, height=ph)
    c.showPage()
c.save()
print("pages:", len(pages))
print("size MB:", round(os.path.getsize(OUT) / 1024 / 1024, 1))
