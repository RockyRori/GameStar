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

## 1. 更新系统并安装必备软件

打开终端，运行以下命令来更新系统并安装 Git、Python3、pip、venv 以及其他必要软件：

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git python3 python3-pip python3-venv
```

## 2. 克隆你的代码仓库

将你的代码仓库克隆到服务器上（请将 `<your-repo-url>` 替换为你的仓库地址）：

```bash
git clone https://github.com/RockyRori/GameStar.git
cd GameStar
```

## 3. 创建 Python 虚拟环境并安装依赖

创建并激活虚拟环境，以便管理依赖：

```bash
python3 -m venv venv
source venv/bin/activate
```

然后安装依赖：

```bash
pip install --upgrade pip
pip install -r ./backend/requirements.txt
```

**注意：**

- 如果云服务器带有 GPU，请确保已安装 NVIDIA 驱动和 CUDA 库，并安装支持 GPU 的 `torch` 版本。
- 如果仅使用 CPU，可以将代码中的 `.to("cuda")` 改为 `.to("cpu")`。

## 4. 模型下载与配置

第一次运行时，Stable Diffusion 模型会自动下载到缓存目录，请注意：

- 模型文件较大（通常需要几 GB），下载可能需要一些时间。
- 如果需要 Hugging Face 访问令牌，请配置环境变量 `HUGGINGFACE_HUB_TOKEN`。

## 5. 测试启动后端服务

使用 `uvicorn` 启动 FastAPI 后端服务，建议在测试模式下运行，绑定到所有网络接口：

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8521
```

然后在浏览器或使用 `curl` 访问 `http://<你的服务器IP>:8521/generate`，检查接口是否正常响应。

```bash
curl http://0.0.0.0:8521/generate
curl http://20.189.123.18:8521/generate
```

## 6. 配置 systemd 服务（可选，便于后台运行）

在 `/etc/systemd/system/` 目录下创建 `gamestar.service` 文件：

```bash
sudo nano /etc/systemd/system/gamestar.service
```

文件内容如下（请替换路径和用户名）：

```ini
[Unit]
Description=GameStar 后端服务
After=network.target

[Service]
User=rocky
WorkingDirectory=/home/rocky/project/GameStar/backend
ExecStart=/home/rocky/project/GameStar/venv/bin/uvicorn main:app --reload --host 0.0.0.0 --port 8521
Restart=always

[Install]
WantedBy=multi-user.target
```

保存后，加载并启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable gamestar.service
sudo systemctl start gamestar.service
```

检查服务状态：

```bash
sudo systemctl status gamestar.service
```

## 7. 配置 Nginx 反向代理（可选）

如果希望使用标准端口（如 `80/443`）访问后端，可以安装 Nginx 并配置反向代理：

```bash
sudo apt install -y nginx
```

创建或编辑 Nginx 配置文件（例如 `/etc/nginx/sites-available/nginxapp`）：

```nginx
server {
    listen 80;
    server_name 20.189.123.18;

    location /ragnition/ {
        proxy_pass http://127.0.0.1:8536/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /gamestar/ {
        proxy_pass http://127.0.0.1:8521/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

启用该配置并重启 Nginx：

```bash
sudo ln -s /etc/nginx/sites-available/nginxapp /etc/nginx/sites-enabled/nginxapp
sudo nginx -t
sudo systemctl restart nginx
```

## 8. 防火墙配置

确保服务器防火墙允许 SSH（22）、HTTP（80）、HTTPS（443）以及后端服务端口（如 `8521`）：

```bash
sudo ufw enable
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8521
```

## 9. 更新代码

直接更新git仓库即可，服务会自动重启。或者使用下面命令来确保服务重启：

```bash
sudo systemctl status gamestar.service
sudo systemctl restart gamestar.service
sudo systemctl status gamestar.service
```

### HTTPS加密

github page强制使用https，因此服务器上面需要安装Cloudflare，并且申请Cloudflare Named Tunnel，最终实现对外使用https的能力。

```bash
screen -S mytunnel
cloudflared tunnel --url http://localhost:8521
```

每一次生成的域名是随机的，比如

```bash
curl https://biblical-ja-retrieved-generates.trycloudflare.com/generate
```

断开会话但进程不会停止

```bash
Ctrl + A, 然后按 D
```

重新连接会话

```bash
screen -r mytunnel
```