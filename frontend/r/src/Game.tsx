import "./Game.css";
import backgroundMusic from "./assets/background.mp3";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Difference {
  x: number;
  y: number;
}

interface ErrorMarker {
  x: number;
  y: number;
  imageIndex: number;
  id: number;
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
  const [errorMarkers, setErrorMarkers] = useState<ErrorMarker[]>([]);
  const timerRef = useRef<number | null>(null);

  // 背景音乐相关
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchNewGame();
  }, []);

  // 倒计时逻辑，每秒减少，时间耗尽结束游戏
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

  // 获取新局数据，同时重置所有状态
  const fetchNewGame = async () => {
    const address = "https://mixing-bits-veteran-maximum.trycloudflare.com";
//     const address = "http://20.189.123.18:8521";
//     const address = "http://localhost:8521";
    const response = await axios.get(`${address}/generate`);
    const timestamp = new Date().getTime();

    setImage1(`${address}/static/${response.data.image1}?t=${timestamp}`);
    setImage2(`${address}/static/${response.data.image2}?t=${timestamp}`);

    setDifferences(response.data.differences);
    setFoundPoints([]);
    setHintPoints([]);
    setHintsLeft(2);
    setScore(0);
    setTimeLeft(120);
    setGameOver(false);
    setErrorMarkers([]);
  };

  // 点击图片处理逻辑，接收额外参数 imageIndex 区分点击的是哪张图片
  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>, imageIndex: number) => {
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
    // 错误点击：扣分，并在点击位置显示红色叉叉
    setScore((prev) => prev - 1);
    const markerId = Date.now() + Math.random();
    const newMarker: ErrorMarker = { x, y, imageIndex, id: markerId };
    setErrorMarkers((prev) => [...prev, newMarker]);
    setTimeout(() => {
      setErrorMarkers((prev) => prev.filter((marker) => marker.id !== markerId));
    }, 1000);
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

  // 自动播放背景音乐
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => console.warn("Auto play music failed Click button to start"));
      }
    }
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => console.warn("Play music failed:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Find The Diff</h1>

      <div className="game-layout">
        <div className="game-images">
          {[image1, image2].map((image, index) => (
            <div key={index} className="image-wrapper">
              {image && (
                <img
                  src={image}
                  alt={`FindTheDiff${index + 1}`}
                  width="512"
                  onClick={(e) => handleImageClick(e, index)}
                />
              )}
              {/* 显示手动选中的正确区域 */}
              {foundPoints.map((point, idx) => (
                <div
                  key={`found-${idx}`}
                  className="circle"
                  style={{ left: `${point.x}px`, top: `${point.y}px` }}
                ></div>
              ))}
              {/* 显示放大镜提示的标记 */}
              {hintPoints.map((point, idx) => (
                <div
                  key={`hint-${idx}`}
                  className="circle hint-circle"
                  style={{ left: `${point.x}px`, top: `${point.y}px` }}
                ></div>
              ))}
              {/* 显示错误点击的红色叉叉 */}
              {errorMarkers
                .filter((marker) => marker.imageIndex === index)
                .map((marker) => (
                  <div
                    key={marker.id}
                    className="error-marker"
                    style={{ left: `${marker.x}px`, top: `${marker.y}px` }}
                  >
                    ✖
                  </div>
                ))}
            </div>
          ))}
        </div>

        <div className="game-controls">
        {/* 音乐播放按钮 */}
          <button className="control-button music-button" onClick={toggleMusic}>
            {isPlaying ? "⏸ To Pause" : "▶ Play Music"}
          </button>
          <div className="status">
            <div className="status-item">
              <span className="status-label">Correct:</span>
              <span className="status-value">{foundPoints.length}/{differences.length}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Countdown:</span>
              <span className="status-value">{timeLeft}s</span>
            </div>
            <div className="status-item">
              <span className="status-label">Score:</span>
              <span className="status-value">{score}</span>
            </div>
          </div>

          <div className="buttons">
            <button className="control-button hint-button" onClick={handleHint} disabled={hintsLeft <= 0 || gameOver}>
              🔍 Magnifier ({hintsLeft})
            </button>
            <button className="control-button newgame-button" onClick={fetchNewGame}>
              🔄 Next Round
            </button>
          </div>
          {gameOver && <div className="game-over">END！</div>}
        </div>
      </div>

      {/* 背景音乐 */}
      <audio ref={audioRef} src={backgroundMusic} loop />
    </div>
  );
};

export default Game;
