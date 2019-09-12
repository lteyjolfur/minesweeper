import React from "react";
import "./App.css";
import "./components/square";
import Game from "./components/game";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game: () => (
        <Game newGame={this.newGame} newGameWithClick={this.newGameWithClick} />
      )
    };
  }

  newGameWithClick = id => {
    console.log("newGame with click");
    this.setState({
      game: () => (
        <Game
          newGame={this.newGame}
          newGameWithClick={this.newGameWithClick}
          clickId={id}
        />
      )
    });
  };

  newGame = () => {
    console.log("newGame");
    this.setState({
      game: () => (
        <Game newGame={this.newGame} newGameWithClick={this.newGameWithClick} />
      )
    });
  };

  render() {
    const ActiveGame = this.state.game;
    return (
      <div className="App">
        <header className="App-header">
          <p>Minesweeper</p>
        </header>
        <ActiveGame />
      </div>
    );
  }
}

/*
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
*/
export default App;
