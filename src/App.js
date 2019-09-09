import React from "react";
import "./App.css";
import "./components/square";
import Game from "./components/game";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Minesweeper</p>
      </header>
      <Game />
    </div>
  );
}

export default App;
