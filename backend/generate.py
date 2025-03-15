import random
import torch
import os
from diffusers import StableDiffusionPipeline
from PIL import Image, ImageDraw

# Stable Diffusion 只加载一次
pipe = None


def load_model():
    global pipe
    if pipe is None:
        model_path = "runwayml/stable-diffusion-v1-5"
        pipe = StableDiffusionPipeline.from_pretrained(model_path, torch_dtype=torch.float16).to("cuda")
        pipe.enable_attention_slicing()
        print("✅ Stable Diffusion 模型加载完成")


load_model()


def generate_images(unique_id: int):
    """生成一对找不同图片，并存储到 static/ 目录"""
    prompt = "A cozy living room with books and a cat"
    img1 = pipe(prompt).images[0]  # 生成第一张图片

    # 复制第一张图片，作为第二张图片
    img2 = img1.copy().convert("RGBA")
    differences = []

    # 从 assets 目录下随机选取不同的 png 文件
    assets_dir = os.path.join(os.path.dirname(__file__), "assets")
    asset_images = []
    try:
        png_files = [f for f in os.listdir(assets_dir) if f.lower().endswith(".png")]
        if png_files:
            # 如果资产图片足够，则采样 5 个不同的文件；否则补足 5 个（可能会有重复）
            if len(png_files) >= 5:
                chosen_files = random.sample(png_files, 5)
            else:
                chosen_files = png_files.copy()
                while len(chosen_files) < 5:
                    chosen_files.append(random.choice(png_files))
            for f in chosen_files:
                asset_path = os.path.join(assets_dir, f)
                asset = Image.open(asset_path).convert("RGBA")
                # 调整资产图片尺寸为 40x40
                asset = asset.resize((28, 28), Image.Resampling.LANCZOS)
                asset_images.append(asset)
        else:
            print("assets 目录中没有 png 文件，将使用默认红色圆点。")
    except Exception as e:
        print("加载资产图片时出错，将使用默认红色圆点。", e)
        asset_images = []

    # 如果没有加载到资产图片，则后续直接用红色圆点
    draw = ImageDraw.Draw(img2) if not asset_images else None

    # 生成 5 处差异位置，每处使用 asset_images 中不同的图片
    for i in range(5):
        x, y = random.randint(50, 500), random.randint(50, 500)
        differences.append({"x": x, "y": y})
        if asset_images:
            asset = asset_images[i]
            # 计算左上角位置，使资产图片中心与 (x, y) 对齐
            pos = (x - 20, y - 20)
            img2.paste(asset, pos, asset)
        else:
            draw.ellipse((x - 10, y - 10, x + 10, y + 10), fill="red")

    STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
    os.makedirs(STATIC_DIR, exist_ok=True)

    # 保存时转换为 RGB 格式（JPEG 不支持 alpha 通道）
    img1_path = os.path.join(STATIC_DIR, f"img1_{unique_id}.jpg")
    img2_path = os.path.join(STATIC_DIR, f"img2_{unique_id}.jpg")
    img1.convert("RGB").save(img1_path)
    img2.convert("RGB").save(img2_path)

    return os.path.basename(img1_path), os.path.basename(img2_path), differences
