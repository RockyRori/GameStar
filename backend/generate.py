import random
import torch
import os
from diffusers import StableDiffusionPipeline
from PIL import Image, ImageDraw

# ✅ Stable Diffusion 只加载一次
pipe = None


def load_model():
    global pipe
    if pipe is None:
        model_path = "runwayml/stable-diffusion-v1-5"
        pipe = StableDiffusionPipeline.from_pretrained(model_path, torch_dtype=torch.float16).to("cuda")
        pipe.enable_attention_slicing()
        print("✅ Stable Diffusion 模型加载完成")


# ✅ 只加载一次模型
load_model()


# ✅ 生成图片（使用传入的 unique_id 作为文件名）
def generate_images(unique_id: int):
    """ 生成一对找不同图片，并存储到 static/ 目录 """
    prompt = "A cozy living room with books and a cat"
    img1 = pipe(prompt).images[0]  # 生成第一张图片

    img2 = img1.copy()
    draw = ImageDraw.Draw(img2)
    differences = []

    for _ in range(5):
        x, y = random.randint(50, 500), random.randint(50, 500)
        draw.ellipse((x - 10, y - 10, x + 10, y + 10), fill="red")
        differences.append({"x": x, "y": y})

    STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
    os.makedirs(STATIC_DIR, exist_ok=True)

    # ✅ 统一使用 i 作为唯一 ID，防止文件增长
    img1_path = os.path.join(STATIC_DIR, f"img1_{unique_id}.jpg")
    img2_path = os.path.join(STATIC_DIR, f"img2_{unique_id}.jpg")

    img1.save(img1_path)
    img2.save(img2_path)

    return os.path.basename(img1_path), os.path.basename(img2_path), differences
