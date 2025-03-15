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
  const [foundPoints, setFoundPoints] = useState<Difference[]>([]);
  const [hintPoint, setHintPoint] = useState<Difference | null>(null);

  useEffect(() => {
    fetchNewGame();
  }, []);

  const fetchNewGame = async () => {
    const response = await axios.get("http://localhost:8000/generate");
    setImage1(`http://localhost:8000/static/${response.data.image1}`);
    setImage2(`http://localhost:8000/static/${response.data.image2}`);
    setDifferences(response.data.differences);
    setFoundPoints([]);
    setHintPoint(null);
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const tolerance = 40;
    const matchedPoint = differences.find(
      (diff) => Math.abs(diff.x - x) < tolerance && Math.abs(diff.y - y) < tolerance
    );

    if (matchedPoint && !foundPoints.some((p) => p.x === matchedPoint.x && p.y === matchedPoint.y)) {
      setFoundPoints([...foundPoints, matchedPoint]);
    }
  };

  return (
    <div className="game-container">
      <h1>找不同游戏</h1>
      <div className="images">
        {[image1, image2].map((image, index) => (
          <div key={index} className="image-wrapper">
            {image && <img src={image} alt={`找不同${index + 1}`} width="512" onClick={handleImageClick} />}
            {foundPoints.map((point, idx) => (
              <div
                key={idx}
                className="circle"
                style={{ left: `${point.x}px`, top: `${point.y}px` }}
              ></div>
            ))}
            {hintPoint && (
              <div
                className="circle hint-circle"
                style={{ left: `${hintPoint.x}px`, top: `${hintPoint.y}px` }}
              ></div>
            )}
          </div>
        ))}
      </div>
      <button onClick={fetchNewGame}>下一局</button>
    </div>
  );
};

export default Game;
