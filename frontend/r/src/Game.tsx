import "./Game.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Difference {
  x: number;
  y: number;
}

const Game: React.FC = () => {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [differences, setDifferences] = useState<Difference[]>([]);
  const [found, setFound] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [foundPoints, setFoundPoints] = useState<Difference[]>([]);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [hintCount, setHintCount] = useState<number>(2); // 放大镜次数
  const [hintPoint, setHintPoint] = useState<Difference | null>(null); // 放大镜显示的点

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  // ✅ 处理点击事件
  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (gameOver || found >= differences.length) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const scaleX = rect.width / 512;
    const scaleY = rect.height / 512;

    const x = (event.clientX - rect.left) / scaleX;
    const y = (event.clientY - rect.top) / scaleY;

    const tolerance = 40; // ✅ 扩大答案判定范围（原来的2倍）
    const matchedPoint = differences.find(
      (diff) =>
        Math.abs(diff.x - x) < tolerance && Math.abs(diff.y - y) < tolerance
    );

    if (matchedPoint) {
      if (!foundPoints.some((p) => p.x === matchedPoint.x && p.y === matchedPoint.y)) {
        setFound(found + 1);
        setFoundPoints([...foundPoints, matchedPoint]);
        setScore(score + 10);
      }
    } else {
      setScore(score - 5);
    }

    if (found + 1 === differences.length) {
      setGameOver(true);
      setScore(score + timeLeft * 2);
    }
  };

  // ✅ 获取新游戏
  const fetchNewGame = async () => {
    setLoading(true);
    setGameOver(false);
    setFound(0);
    setScore(0);
    setTimeLeft(60);
    setFoundPoints([]);
    setHintPoint(null);
    setHintCount(2);

    try {
      const response = await axios.get("http://localhost:8000/generate");

      if (response.data.error) {
        console.warn("⚠️ 没有可用的图片，等待重新生成...");
        setLoading(false);
        return;
      }

      setImage1(`http://localhost:8000/static/${response.data.image1}`);
      setImage2(`http://localhost:8000/static/${response.data.image2}`);
      setDifferences(response.data.differences);
      setLoading(false);
    } catch (error) {
      console.error("❌ 获取图片失败", error);
      setLoading(false);
    }
  };

  // ✅ 放大镜功能
  const useHint = () => {
    if (hintCount > 0) {
      const remainingDifferences = differences.filter(
        (diff) =>
          !foundPoints.some((p) => p.x === diff.x && p.y === diff.y)
      );

      if (remainingDifferences.length > 0) {
        const hintPoint = remainingDifferences[0]; // ✅ 选择一个未找到的不同点
        setHintPoint(hintPoint);
        setHintCount(hintCount - 1);
      }
    }
  };

  return (
    <div className="game-container">
      <h1>找不同游戏</h1>
      <div className="game-layout">
        <div className="game-area">
          {loading ? (
            <p>⏳ 加载图片中...</p>
          ) : (
            image1 &&
            image2 && (
              <div className="images">
                <div className="image-wrapper">
                  <img src={image1} alt="找不同1" width="400" onClick={handleImageClick} />
                  {foundPoints.map((point, index) => (
                    <div
                      key={index}
                      className="circle"
                      style={{ left: `${point.x / 5}px`, top: `${point.y / 5}px` }}
                    ></div>
                  ))}
                  {hintPoint && (
                    <div
                      className="circle hint-circle"
                      style={{ left: `${hintPoint.x / 5}px`, top: `${hintPoint.y / 5}px` }}
                    ></div>
                  )}
                </div>

                <div className="image-wrapper">
                  <img src={image2} alt="找不同2" width="400" onClick={handleImageClick} />
                  {foundPoints.map((point, index) => (
                    <div
                      key={index}
                      className="circle"
                      style={{ left: `${point.x / 5}px`, top: `${point.y / 5}px` }}
                    ></div>
                  ))}
                  {hintPoint && (
                    <div
                      className="circle hint-circle"
                      style={{ left: `${hintPoint.x / 5}px`, top: `${hintPoint.y / 5}px` }}
                    ></div>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        <div className="game-info">
          <p>⏳ 剩余时间: {timeLeft}s</p>
          <p>🎯 已找到: {found} / {differences.length}</p>
          <p>🏆 当前得分: {score}</p>

          <button onClick={fetchNewGame}>下一局</button>
          <button onClick={useHint} disabled={hintCount === 0}>
            🔍 放大镜 ({hintCount} 次)
          </button>

          {gameOver && <p>🎉 游戏结束！点击“下一局”再玩一次！</p>}
        </div>
      </div>
    </div>
  );
};

export default Game;
