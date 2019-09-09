import React, { Component } from "react";

import Board from "./board";
import Smiley from "./smiley";
import Counter from "./counter";

class Game extends Component {
  state = {
    smiley: {
      display: { smiley: "🙂", worried: "😯", win: "😎", lose: "💀" },
      displayIndex: "smiley"
    }
  };

  HandleMouseDown = () => {
    let smiley = this.state.smiley;
    smiley = "scared";
    this.setState({ smiley: smiley });
  };

  render() {
    return (
      <div
        style={{
          background: "rgba(150,150,150,1)",
          width: 48 * 9 + 62,
          height: 50 * 9 + 75 + 75 + 18,
          padding: 25,
          margin: "auto",
          marginTop: 50,
          border: "3px solid wheat",
          borderTopColor: "rgba(20,20,20,1)",
          borderLeftColor: "rgba(20,20,20,1)"
        }}
      >
        <div
          style={{
            height: 72 + 6 + 24,
            background: "rgba(150,150,150,1)",
            marginBottom: 25,
            border: "3px solid wheat",
            borderTopColor: "rgba(20,20,20,1)",
            borderLeftColor: "rgba(20,20,20,1)"
          }}
        >
          <Counter float="left" />

          <Smiley smiley={this.state.smiley} />
          <Counter float="right" />
        </div>
        <div
          style={{
            border: "3px solid wheat",
            borderTopColor: "rgba(20,20,20,1)",
            borderLeftColor: "rgba(20,20,20,1)"
          }}
        >
          <Board />
        </div>
        <div id="trapezoid"></div>
      </div>
    );
  }
}

export default Game;
