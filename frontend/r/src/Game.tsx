import React, { useState, useEffect } from "react";
import axios from "axios";

interface GameData {
  image1: string;
  image2: string;
  differences: number;
}

const Game: React.FC = () => {
  const [data, setData] = useState<GameData | null>(null);
  const [found, setFound] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);

  useEffect(() => {
    axios.get<GameData>("http://localhost:8000/generate")
      .then(response => setData(response.data))
      .catch(error => console.error("Error fetching game data:", error));
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleClick = () => {
    if (found < (data?.differences || 0)) {
      setFound(found + 1);
    }
  };

  const submitScore = () => {
    axios.post("http://localhost:8000/submit", {
      player_name: "Player1",
      differences_found: found,
      time_left: timeLeft
    }).then(res => alert(`Score: ${res.data.score}`));
  };

  return (
    <div>
      <h1>Find the Differences</h1>
      {data && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={`http://localhost:8000/${data.image1}`} onClick={handleClick} width="400" />
          <img src={`http://localhost:8000/${data.image2}`} onClick={handleClick} width="400" />
        </div>
      )}
      <p>Found: {found} / {data?.differences}</p>
      <p>Time Left: {timeLeft}s</p>
      <button onClick={submitScore}>Submit Score</button>
    </div>
  );
};

export default Game;
