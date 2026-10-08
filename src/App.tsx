import React from "react";
import "./App.css";
import Game from "./components/game";

interface AppState {
  game: () => React.JSX.Element;
}

class App extends React.Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      game: () => <Game newGame={this.newGame} />
    };
  }

  newGame = () => {
    this.setState({
      game: () => <Game newGame={this.newGame} />
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

export default App;
