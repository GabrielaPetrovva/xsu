from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1] / "images"
logo = Image.open(root / "logo.png").convert("RGBA")
width, height = 1200, 630
img = Image.new("RGB", (width, height), (15, 84, 56))
draw = ImageDraw.Draw(img)
draw.rectangle([0, height - 8, width, height], fill=(201, 168, 76))

max_h = 280
ratio = max_h / logo.height
logo = logo.resize((int(logo.width * ratio), max_h), Image.Resampling.LANCZOS)
img.paste(logo, ((width - logo.width) // 2, 90), logo)

font_path = Path("C:/Windows/Fonts/segoeui.ttf")
font = ImageFont.truetype(str(font_path), 42) if font_path.exists() else ImageFont.load_default()
font_s = ImageFont.truetype(str(font_path), 28) if font_path.exists() else font

title = "СУ „Йордан Йовков“"
sub = "Сливен"
bbox = draw.textbbox((0, 0), title, font=font)
draw.text(((width - (bbox[2] - bbox[0])) // 2, 400), title, fill="white", font=font)
bbox = draw.textbbox((0, 0), sub, font=font_s)
draw.text(((width - (bbox[2] - bbox[0])) // 2, 460), sub, fill=(201, 168, 76), font=font_s)

out = root / "og-share.jpg"
img.save(out, "JPEG", quality=85, optimize=True)
print(out, out.stat().st_size)
