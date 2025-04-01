# GameStar

LU CDS521 Project GameStar Team

# Spot-the-Difference Game

## 🌟 项目介绍

**Find The Diff Game** 是一款基于 **Stable Diffusion** 生成图片的「找不同」游戏。游戏自动生成两张大致相同但有 5
处差异的图片，玩家需要在指定时间内点击差异点。

---

## ✨ 人工智能技术使用说明

### **1. 为什么使用 Stable Diffusion?**

Stable Diffusion 是一种充分利用 **扩散模型 (Diffusion Model)** 生成图片的专科 AI 技术，可以在提供较大自由度的同时，生成高质量的图像。

**应用 Stable Diffusion 的目的：**

- 生成 **基础图片**，提高游戏体验和视觉艺术品质
- 实现 **自动化找不同图片生成**，防止手动编辑
- 使用 AI 在 **实时场景中制造差异**

### **2. 人工智能技术原理**

#### **(1) Stable Diffusion 图像生成原理**

Stable Diffusion 通过“**添加噪声 → 逐步恢复**”的过程进行图像生成：

1. 从一幕随机噪声开始
2. 使用 Transformer 学习大量图像数据库
3. 逐步移除噪声，生成有意义的图像
4. 在游戏中，我们可以通过“反向编译”在生成图像后增加差异

#### **(2) AI 差异生成机制**

1. **先生成一张基础图片**，例如：“一个安静的公园”
2. **下一步，在其中随机修改 5 处**，在图片上方叠加一个新的物体
3. **利用 OpenCV 添加可视化标记**，便于后续判定用户的点击是否正确

---

## ✨ 使用指南

### **安装后端**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8521
```

### **安装前端**

```bash
cd frontend/r
npm install
npm run dev
```

### **更新依赖**

```bash
npm audit
npm install
```

### **部署到 GitHub Pages**

```bash
cd ./frontend/r
npm run build
npm run deploy
```

### **游戏玩法**

1. 游戏生成 2 张大致相同的 AI 图片
2. 玩家需在 120s 内点击 5 处不同
3. 正确点击完成后，计算得分，展示排行榜
