from fastapi import FastAPI, HTTPException
from generate import generate_images
from pydantic import BaseModel
import random

app = FastAPI()
# CORS配置
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Submission(BaseModel):
    player_name: str
    differences_found: int
    time_left: float


# 生成图片API
@app.get("/generate")
def generate():
    img1_path, img2_path, differences = generate_images()
    return {"image1": img1_path, "image2": img2_path, "differences": len(differences)}


# 提交答案API
@app.post("/submit")
def submit_result(data: Submission):
    score = data.differences_found * 10 + int(data.time_left) * 2
    return {"message": "Score submitted!", "score": score}
