import React, { Component } from "react";

import Board from "./board";
import Smiley from "./smiley";
import Counter from "./counter";
import { isGenericTypeAnnotation } from "@babel/types";

class Game extends Component {
  constructor(props) {
    super(props);
    const gameSize = 9;
    const mines = 10;

    let squares = Array(gameSize);
    const colorMap = [
      "rgba(0,0,0,0)",
      "blue",
      "green",
      "red",
      "darkblue",
      "brown",
      "cyan",
      "black",
      "grey"
    ];
    for (let i = 0; i < squares.length; i++) {
      squares[i] = Array(gameSize);
      for (let j = 0; j < squares.length; j++) {
        squares[i][j] = {
          id: i * 10 + j,
          displayIndex: "blank",
          bomb: false,
          clicked: false,
          flag: 0,
          display: {
            blank: { text: "", style: { margin: "0px" } },
            flag: { text: "⛳", style: { margin: "0px" } },
            explosion: {
              text: "💥",
              style: { backgroundColor: "red", border: "2px black" }
            },
            value: {
              text: "NA",
              style: { background: "rgba(150,150,150,1)", borderColor: "black" }
            },
            bomb: {
              text: "💣",
              style: { background: "rgba(150,150,150,1)", borderColor: "black" }
            },
            question: { text: "❓", style: { margin: "0px" } },
            wrong: { text: "❌", style: { margin: "0px" } }
          }
        };
      }
    }
    //console.log(squares[8][8]);
    let iterator = 0;
    while (iterator < mines) {
      const i = Math.floor(Math.random() * gameSize);
      const j = Math.floor(Math.random() * gameSize);
      //console.log(i + " " + j);
      if (squares[i][j].bomb === false) {
        squares[i][j].bomb = true;
        //iterator++;
        //console.log("bomb " + squares[i][j].id);
        iterator++;
      }
    }
    //console.log(squares[0][0].bomb);

    for (let i = 0; i < gameSize; i++) {
      const iRange = this.findRange(i, gameSize);
      for (let j = 0; j < gameSize; j++) {
        const jRange = this.findRange(j, gameSize);
        let value = 0;
        for (let I = 0; I < iRange.length; I++) {
          for (let J = 0; J < jRange.length; J++) {
            if (squares[iRange[I]][jRange[J]].bomb) {
              value++;
            }
          }
        }
        if (value === 0) {
          value = "";
        }
        squares[i][j].display.value = {
          text: value,
          style: {
            color: colorMap[value],
            background: "rgba(150,150,150,1)",
            borderColor: "#101010",
            borderWidth: "1px"
          }
        };
        squares[i][j].Ranges = { iRange: iRange, jRange: jRange };
      }
    }
    this.state = {
      squares: squares,
      win: false,
      lose: false,
      numFlags: 0,
      smiley: {
        display: { smiley: "🙂", worried: "😯", win: "😎", lose: "💀" },
        displayIndex: "smiley"
      },
      flags: 0,
      mines: 10,
      squaresClicked: 0,
      gameSize: gameSize * gameSize,
      time: 0,
      timerRunning: false,
      timerHandle: 0,
      firstClick: true,
      rightButtonDown: false
    };
  }

  componentDidMount() {
    console.log("mounted");
    if (typeof this.props.clickId !== "undefined") {
      this.handleClick(this.props.clickId);
    }
  }

  componentWillUnmount() {
    console.log("unMounted");
    this.stopTimer();
  }

  findRange = (i, gameSize) => {
    let range = [i - 1, i, i + 1];
    if (i > 0 && i < gameSize - 1) {
    } else if (i === 0) {
      range = range.slice(1, 3);
    } else {
      range = range.slice(0, 2);
    }
    return range;
  };

  handleHover = () => {
    this.setState({ hover: !this.state.hover });
  };

  checkWin = () => {
    let clicked = 0;
    this.state.squares.map(row =>
      row.map(square => {
        if (square.clicked) {
          clicked++;
        }
      })
    );
    if (clicked === this.state.gameSize - this.state.mines) {
      this.handleWin();
      this.setState({ win: true });
    }
  };

  handleLose = () => {
    this.stopTimer();
    let squares = this.state.squares.map(row =>
      row.map(square => {
        if (square.clicked === false && square.bomb && square.flag !== 1) {
          square.displayIndex = "bomb";
        }
        if (square.flag === 1 && square.bomb === false) {
          square.displayIndex = "wrong";
        }
      })
    );
    let smiley = this.state.smiley;
    smiley.displayIndex = "lose";
    smiley.display["smiley"] = "💀";
    this.setState({ squares: squares, smiley: smiley });
  };

  handleWin = () => {
    // put glasses, put flag on all mines disable board
    console.log("handleWin");
    let smiley = this.state.smiley;
    smiley.displayIndex = "win";
    smiley.display["smiley"] = "😎";
    let squares = this.state.squares.map(row =>
      row.map(square => {
        if (square.bomb === true) {
          square.displayIndex = "flag";
        }
      })
    );
    this.stopTimer();
    this.setState({ squares: squares, smiley: smiley, win: true });
  };

  makeSmile = () => {
    let smiley = this.state.smiley;
    smiley.displayIndex = "smiley";
    this.setState({ smiley: smiley });
  };

  handleClick = (id, event) => {
    //console.log("handleClick id: " + id);
    if (this.state.firstClick) {
      console.log("firstClick");
      const [row, column] = this.getRowColumn(id);
      if (this.state.squares[row][column].bomb) {
        console.log("1stBomb");
        this.props.newGameWithClick(id);
        return;
      }
      this.startTimer();
      this.setState({ firstClick: false }, () => {
        this.handleClick(id);
      });
      return;
    }
    if (this.state.rightButtonDown === true) {
      console.log("true");
      this.handleMouseUp(id, () => {
        this.handleDoubleClick(id);
      });

      return;
    }
    this.makeSmile();
    let squares = this.state.squares.slice();
    let lose = this.state.lose;
    const [row, column] = this.getRowColumn(id);
    const square = squares[row][column];
    if (square.clicked || square.flag === 1 || lose) {
      return;
    }
    squares[row][column].clicked = true;
    if (square.bomb) {
      lose = true;
      squares[row][column].displayIndex = "explosion";
      this.handleLose();
    } else {
      squares[row][column].displayIndex = "value";
    }

    const squaresClicked = this.state.squaresClicked + 1;
    if (!lose) {
      this.checkWin();
      if (this.state.gameSize - squaresClicked === this.state.mines) {
        console.log("win");
        this.handleWin();
        return;
      }
    }
    this.setState({
      squares: squares,
      lose: lose,
      squaresClicked: squaresClicked
    });
    if (squares[row][column].display.value.text === "") {
      this.clickAll(row, column);
    }
  };

  startTimer = () => {
    if (this.state.timerRunning === false) {
      const timerHandle = setInterval(this.handleTimer, 1000);
      this.setState({ timerRunning: true, timerHandle: timerHandle });
    }
  };

  stopTimer = () => {
    clearInterval(this.state.timerHandle);
    this.setState({ timerHandle: 0, timerRunning: false });
  };

  handleTimer = () => {
    let time = this.state.time;
    if (++time < 1000) {
      this.setState({ time: time });
    }
  };

  callHandleClick = (row, column) => {
    this.handleClick(row * 10 + column);
  };

  clickAll = (row, column) => {
    this.checkAllAdjacent(row, column, this.callHandleClick);
  };

  checkAllAdjacent = (row, column, method) => {
    const iRange = this.state.squares[row][column].Ranges.iRange;
    const jRange = this.state.squares[row][column].Ranges.jRange;
    let value = 0;
    for (let i = 0; i < iRange.length; i++) {
      for (let j = 0; j < jRange.length; j++) {
        value += method(iRange[i], jRange[j]);
      }
    }
    return value;
  };

  handleContextMenu = id => {
    //if(this.state.timerHandle !== 0 && this.state.startTimer === 1){
    //  this.setState({timerHandle})
    //}
    const flagMap = ["blank", "flag", "question"];
    let squares = this.state.squares.slice();
    let flags = this.state.flags;
    const [row, column] = this.getRowColumn(id);
    this.makeSmile();
    this.handleMouseUp();
    if (squares[row][column].clicked === false) {
      squares[row][column].flag = (squares[row][column].flag + 1) % 3;
      if (squares[row][column].flag === 1) {
        flags++;
      } else if (squares[row][column].flag === 2) {
        flags--;
      }
      squares[row][column].displayIndex = flagMap[squares[row][column].flag];
      this.setState({ squares: squares, flags: flags });
    }
  };

  handleDoubleClick = id => {
    let squares = this.state.squares.slice();
    const [row, column] = this.getRowColumn(id);
    if (squares[row][column].clicked === true) {
      const flags = this.checkAllAdjacent(row, column, this.countAdjacentFlags);
      //console.log("flags is:" + flags);
      //console.log("value is:" + squares[row][column].display.value);
      if (flags === squares[row][column].display.value.text) {
        this.clickAll(row, column);
      }
    }
  };

  countAdjacentFlags = (row, column) => {
    let squares = this.state.squares;
    //console.log("row is :" + row + ", column is :" + column);
    let flags = 0;
    if (squares[row][column].flag === 1) {
      flags++;
    }
    //console.log("flags is :" + flags);
    return flags;
  };

  getRowColumn = id => {
    const row = Math.floor(id / 10);
    const column = id % 10;
    return [row, column];
  };

  handleMouseDown = event => {
    console.log(event.button);
    let smiley = this.state.smiley;
    smiley.displayIndex = "worried";
    if (event.button === 2) {
      this.setState({ rightButtonDown: true });
    }
    this.setState({ smiley: smiley });
  };

  handleMouseUp = (id, callback) => {
    console.log("up");
    this.makeSmile();
    if (typeof callback !== "undefined") {
      this.setState({ rightButtonDown: false }, callback);
    } else {
      this.setState({ rightButtonDown: false });
    }
  };

  //onClickSmiley = () => {
  //  this.props.newGame();
  //};

  render() {
    //console.log(this.state.timerHandle);
    return (
      <div
        className="outerBox"
        style={{
          background: "rgba(150,150,150,1)",
          width: 48 * 9 + 62,
          height: 50 * 9 + 75 + 75 + 18,
          padding: 25,
          margin: "auto",
          marginTop: 50
        }}
      >
        <div
          className="outerBox"
          style={{
            height: 72 + 6 + 24,
            background: "rgba(150,150,150,1)", // put in class
            marginBottom: 25
          }}
        >
          <Counter float="left" number={this.state.mines - this.state.flags} />
          <Smiley smiley={this.state.smiley} onClick={this.props.newGame} />
          <Counter float="right" number={this.state.time} />
        </div>
        <div className="outerBox">
          <Board
            lose={this.state.lose}
            win={this.state.win}
            squares={this.state.squares}
            onHover={this.handleHover}
            onClick={this.handleClick}
            onContextMenu={this.handleContextMenu}
            onDoubleClick={this.handleDoubleClick}
            onMouseDown={event => {
              this.handleMouseDown(event);
            }}
            onMouseUp={this.handleMouseup}
          />
        </div>
      </div>
    );
  }
}

export default Game;
