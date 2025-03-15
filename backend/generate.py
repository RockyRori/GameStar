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
        # 自动检测是否有 GPU
        device = "cuda" if torch.cuda.is_available() else "cpu"
        # CPU 上通常不支持 float16，使用 float32
        dtype = torch.float16 if device == "cuda" else torch.float32
        pipe = StableDiffusionPipeline.from_pretrained(model_path, torch_dtype=dtype).to(device)
        if device == "cuda":
            pipe.enable_attention_slicing()
        print(f"✅ Stable Diffusion 模型加载完成，使用设备：{device}")


load_model()


def generate_images(unique_id: int):
    """生成一对找不同图片，并存储到 static/ 目录"""
    # 定义 28 种不同场景的提示词
    prompts = [
        "A cozy living room with books and a cat",
        "A futuristic cityscape at night with neon lights",
        "A serene beach at sunset with palm trees",
        "A bustling medieval marketplace in a historic town",
        "A quiet mountain cabin in a snowy forest",
        "A vibrant flower garden with butterflies",
        "An ancient temple in a lush jungle",
        "A modern art gallery with abstract paintings",
        "A busy urban street with towering skyscrapers",
        "A mystical forest with glowing mushrooms",
        "A rustic farmyard with a red barn and animals",
        "A charming European village with cobblestone streets",
        "A grand castle on a hill under a starry sky",
        "A futuristic laboratory with holograms and robots",
        "A peaceful lake surrounded by autumn trees",
        "A desert oasis with date palms and clear blue water",
        "A bustling harbor with ships and seagulls",
        "A magical winter wonderland with ice sculptures",
        "A lively carnival with colorful tents and rides",
        "A traditional Japanese garden with a koi pond",
        "A vibrant street market with exotic fruits and spices",
        "A serene monastery on a mountain top",
        "A lush vineyard in the countryside during harvest",
        "A dynamic sports stadium filled with cheering fans",
        "A quaint coffee shop in a rainy city",
        "A grand library with towering bookshelves",
        "A whimsical treehouse village in an enchanted forest",
        "A futuristic space station orbiting Earth"
    ]
    # 随机选择一种提示词
    prompt = random.choice(prompts)

    # 生成第一张图片
    img1 = pipe(prompt).images[0]

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
                # 调整资产图片尺寸为 40x40，使用 LANCZOS 重采样
                asset = asset.resize((40, 40), Image.LANCZOS)
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
