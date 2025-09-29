# save as make_icons.py
from PIL import Image
from pathlib import Path

# ==== 設定 ====
SOURCE_IMAGE = r"logo_source.png"  # ←元画像のパス（PNG/JPGどちらでもOK）
OUT_DIR = Path("./icons")          # 出力先フォルダ
BACKGROUND = (255, 255, 255, 0)    # 透明背景（JPGにするなら(255,255,255)など）

# 生成リスト（ファイル名, サイズ）
PNG_TARGETS = [
    ("favicon-16x16.png", 16),
    ("favicon-32x32.png", 32),
    ("apple-touch-icon.png", 180),
    ("android-chrome-192x192.png", 192),
    ("android-chrome-512x512.png", 512),
    ("mstile-150x150.png", 150),
]

ICO_SIZES = [16, 32, 48]  # マルチアイコン内のサイズ

def load_as_square(src: Image.Image, size: int) -> Image.Image:
    """中央クロップで正方形→目的サイズにリサイズ（ロゴが縦長/横長でも均等にトリミング）"""
    w, h = src.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    src_sq = src.crop((left, top, left + side, top + side))
    return src_sq.resize((size, size), Image.LANCZOS)

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    base = Image.open(SOURCE_IMAGE).convert("RGBA")

    # --- PNG各種 ---
    for name, size in PNG_TARGETS:
        im = load_as_square(base, size)
        out_path = OUT_DIR / name
        im.save(out_path, format="PNG")
        print(f"✔ {out_path} ({size}x{size})")

    # --- ICO（マルチサイズ）---
    # 一度最大サイズをベースにして sizes= を渡す
    largest = max(ICO_SIZES)
    im_large = load_as_square(base, largest)
    ico_path = OUT_DIR / "favicon.ico"
    im_large.save(ico_path, sizes=[(s, s) for s in ICO_SIZES])
    print(f"✔ {ico_path} (sizes: {ICO_SIZES})")

    print("\n完了！ icons/ フォルダをサイトの公開ディレクトリへ配置してください。")

if __name__ == "__main__":
    main()
