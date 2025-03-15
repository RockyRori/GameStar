import random
import torch
from diffusers import StableDiffusionPipeline
from PIL import Image, ImageDraw

model_path = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionPipeline.from_pretrained(model_path, torch_dtype=torch.float16).to("cuda")
pipe.enable_attention_slicing()


def generate_images():
    prompt = "A cozy living room with books and a cat"
    img1 = pipe(prompt).images[0]  # 生成第一张图片

    img2 = img1.copy()  # 复制图片，稍作修改
    draw = ImageDraw.Draw(img2)

    differences = []
    for _ in range(5):
        x, y = random.randint(50, 500), random.randint(50, 500)
        draw.ellipse((x, y, x + 20, y + 20), fill="red")  # 标记出不同点
        differences.append((x, y))

    img1.save("static/img1.jpg")
    img2.save("static/img2.jpg")

    return "static/img1.jpg", "static/img2.jpg", differences
