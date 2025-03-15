import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "./Game";
import Water from "./Water";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/water" element={<Water />} />
      </Routes>
    </Router>
  );
};

export default App;
