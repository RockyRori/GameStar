```
spot-the-difference-game/
│── backend/ # 后端 (FastAPI + Diffusion Model)
│ ├── main.py # API 服务器（FastAPI）
│ ├── generate.py # 生成图片（使用Diffusion）
│ ├── utils.py # 辅助函数（图片处理等）
│ ├── requirements.txt # 后端依赖
│
│── frontend/ # 前端 (React + Phaser.js)
│ ├── src/
│ │ ├── components/ # 组件
│ │ ├── App.js # 主游戏逻辑
│ │ ├── Game.js # 游戏主界面
│ │ ├── api.js # 调用后端API
│ ├── public/
│ ├── package.json # 前端依赖
│
│── models/ # AI模型存储
│ ├── model.pth # 训练好的Diffusion模型
│
│── README.md # 项目说明
│── .gitignore # Git忽略文件
```