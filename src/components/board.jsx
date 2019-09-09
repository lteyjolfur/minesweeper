import React, { Component } from "react";
import Square from "./square";
//import { classMethod } from "@babel/types";

class Board extends Component {
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
    this.state = { squares: squares, win: false, lose: false, numFlags: 0 };
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

  handleLose = () => {
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
    this.setState({ squares: squares });
  };

  handleClick = id => {
    console.log("handleClick id: " + id);
    let squares = this.state.squares.slice();
    let lose = this.state.lose;
    const [row, column] = this.getRowColumn(id);
    const square = squares[row][column];
    if (square.clicked || square.flag === 1 || lose) {
      return;
    }
    squares[row][column].clicked = true;
    squares[row][column].displayIndex = "value";
    if (square.bomb) {
      lose = true;
      squares[row][column].displayIndex = "explosion";
      this.handleLose();
    }
    this.setState({ squares: squares, lose: lose });
    if (squares[row][column].display.value.text === "") {
      this.clickAll(row, column);
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
    console.log("value is:" + value);
    return value;
  };

  HandleContextMenu = id => {
    const flagMap = ["blank", "flag", "question"];
    let squares = this.state.squares.slice();
    const [row, column] = this.getRowColumn(id);
    if (squares[row][column].clicked === false) {
      squares[row][column].flag = (squares[row][column].flag + 1) % 3;
      squares[row][column].displayIndex = flagMap[squares[row][column].flag];
      this.setState({ squares: squares });
    }
  };

  handleDoubleClick = id => {
    let squares = this.state.squares.slice();
    const [row, column] = this.getRowColumn(id);
    if (squares[row][column].clicked === true) {
      const flags = this.checkAllAdjacent(row, column, this.countFlags);
      //console.log("flags is:" + flags);
      //console.log("value is:" + squares[row][column].display.value);
      if (flags === squares[row][column].display.value.text) {
        this.clickAll(row, column);
      }
    }
  };

  countFlags = (row, column) => {
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

  render() {
    //console.log(this.state.squares);
    let index = 0;
    return (
      <div style={{ pointerEvents: this.state.lose ? "none" : "auto" }}>
        {this.state.squares.map(row => (
          <div key={"div" + index++}>
            {row.map(square => (
              <Square
                key={square.id}
                square={square}
                onHover={this.handleHover}
                onClick={this.handleClick}
                onContextMenu={this.HandleContextMenu}
                onDoubleClick={this.handleDoubleClick}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default Board;
