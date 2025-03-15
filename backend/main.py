import os
import json
import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from generate import generate_images, load_model

app = FastAPI()

# ✅ 允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 目录与存储路径
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
JSON_PATH = os.path.join(STATIC_DIR, "image_pool.json")
os.makedirs(STATIC_DIR, exist_ok=True)

# ✅ 加载模型（只执行一次）
load_model()

# ✅ 读取或初始化图片池
image_pool = []
lock = threading.Lock()  # 🔒 线程锁

if os.path.exists(JSON_PATH):
    with open(JSON_PATH, "r") as f:
        image_pool = json.load(f)


def initialize_image_pool():
    """🔄 重新生成 5 组图片，并存储到图片池"""
    global image_pool
    with lock:  # 🔒 确保只有一个线程可以执行
        print("🔄 正在生成新图片池...")
        new_pool = []
        for i in range(10):  # ✅ 用 i 作为唯一标识
            img1, img2, differences = generate_images(i)
            new_pool.append({"img1": img1, "img2": img2, "differences": differences, "used": False})

        with open(JSON_PATH, "w") as f:
            json.dump(new_pool, f)

        image_pool = new_pool  # ✅ 替换旧图片池
        print("✅ 新图片池生成完成！")


@app.get("/generate")
def get_image():
    """ 获取未使用的图片，并检查是否需要重新生成 """
    global image_pool

    with lock:  # 🔒 确保线程安全
        unused_images = [img for img in image_pool if not img["used"]]

        if unused_images:
            # ✅ 先返回最后一组可用图片
            img = unused_images[0]
            img["used"] = True
            with open(JSON_PATH, "w") as f:
                json.dump(image_pool, f)

            # ✅ 只剩 1 组未使用时，触发后台异步生成新的 5 组
            if len(unused_images) <= 2:
                threading.Thread(target=initialize_image_pool).start()

            return {
                "image1": img["img1"],
                "image2": img["img2"],
                "differences": img["differences"]
            }

    return {"error": "No available images. Generating new images, please wait."}


# ✅ 直接返回静态图片
@app.get("/static/{filename}")
def get_static_image(filename: str):
    file_path = os.path.join(STATIC_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/jpeg")
    return {"error": "File not found"}
