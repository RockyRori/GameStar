import "./Game.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Difference {
  x: number;
  y: number;
}

const Game: React.FC = () => {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [differences, setDifferences] = useState<Difference[]>([]);
  const [foundPoints, setFoundPoints] = useState<Difference[]>([]);
  const [hintPoints, setHintPoints] = useState<Difference[]>([]);
  const [hintsLeft, setHintsLeft] = useState<number>(2);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchNewGame();
  }, []);

  // 倒计时，每秒减少，时间耗尽结束游戏
  useEffect(() => {
    if (gameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameOver]);

  // 检查是否所有差异已被手动找出，若是则结束游戏并奖励剩余秒数的分数
  useEffect(() => {
    if (differences.length > 0 && foundPoints.length === differences.length && !gameOver) {
      setGameOver(true);
      setScore((prev) => prev + timeLeft);
    }
  }, [foundPoints, differences, timeLeft, gameOver]);

  // 新局：重置所有状态
  const fetchNewGame = async () => {
    const response = await axios.get("http://localhost:8000/generate");
    setImage1(`http://localhost:8000/static/${response.data.image1}`);
    setImage2(`http://localhost:8000/static/${response.data.image2}`);
    setDifferences(response.data.differences);
    setFoundPoints([]);
    setHintPoints([]);
    setHintsLeft(2);
    setScore(0);
    setTimeLeft(120);
    setGameOver(false);
  };

  // 点击图片逻辑：若点击落在未手动选中的正确区域，则加分并将其加入 foundPoints，同时移除提示标记；错误点击扣分
  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (gameOver) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const tolerance = 40;

    const clickedDiff = differences.find(
      (diff) =>
        Math.abs(diff.x - x) < tolerance &&
        Math.abs(diff.y - y) < tolerance
    );

    if (clickedDiff) {
      const alreadyFound = foundPoints.some(
        (p) => p.x === clickedDiff.x && p.y === clickedDiff.y
      );
      if (!alreadyFound) {
        setFoundPoints([...foundPoints, clickedDiff]);
        setScore((prev) => prev + 10);
        // 如果该区域之前被提示过，则移除提示标记
        setHintPoints((prev) =>
          prev.filter((p) => !(p.x === clickedDiff.x && p.y === clickedDiff.y))
        );
      }
      return;
    }
    // 错误点击扣分
    setScore((prev) => prev - 1);
  };

  // 放大镜提示功能：从未手动选中的且未提示过的差异中选择一个
  const handleHint = () => {
    if (gameOver) return;
    if (hintsLeft <= 0) return;
    const remaining = differences.find(
      (diff) =>
        !foundPoints.some((p) => p.x === diff.x && p.y === diff.y) &&
        !hintPoints.some((p) => p.x === diff.x && p.y === diff.y)
    );
    if (!remaining) return;
    setHintPoints([...hintPoints, remaining]);
    setHintsLeft(hintsLeft - 1);
  };

  return (
    <div className="game-container">
      <h1>找不同游戏</h1>
      {/* 状态栏：显示答对次数、倒计时和分数 */}
      <div className="status">
        <span>答对次数: ({foundPoints.length}/{differences.length})</span>
        <span>倒计时: {timeLeft}秒</span>
        <span>分数: {score}</span>
      </div>
      <div className="controls">
        <button onClick={handleHint} disabled={hintsLeft <= 0 || gameOver}>
          🔍 放大镜 ({hintsLeft})
        </button>
      </div>
      <div className="images">
        {[image1, image2].map((image, index) => (
          <div key={index} className="image-wrapper">
            {image && (
              <img
                src={image}
                alt={`找不同${index + 1}`}
                width="512"
                onClick={handleImageClick}
              />
            )}
            {/* 展示用户手动选中的正确区域 */}
            {foundPoints.map((point, idx) => (
              <div
                key={`found-${idx}`}
                className="circle"
                style={{ left: `${point.x}px`, top: `${point.y}px` }}
              ></div>
            ))}
            {/* 展示放大镜提示的标记（不计入答对次数） */}
            {hintPoints.map((point, idx) => (
              <div
                key={`hint-${idx}`}
                className="circle hint-circle"
                style={{ left: `${point.x}px`, top: `${point.y}px` }}
              ></div>
            ))}
          </div>
        ))}
      </div>
      {gameOver && <div className="game-over">游戏结束！</div>}
      <button onClick={fetchNewGame}>下一局</button>
    </div>
  );
};

export default Game;
