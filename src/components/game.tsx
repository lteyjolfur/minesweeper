import { Component } from "react";

import Board from "./board";
import Smiley from "./smiley";
import Counter from "./counter";
import { SquareData } from "./types";

interface GameProps {
  newGame: () => void;
}

interface GameState {
  squares: SquareData[][];
  win: boolean;
  lose: boolean;
  numFlags: number;
  smiley: {
    display: Record<string, string>;
    displayIndex: string;
  };
  flags: number;
  mines: number;
  squaresClicked: number;
  gameSize: number;
  time: number;
  timerRunning: boolean;
  timerHandle: number;
  firstClick: boolean;
  rightButtonDown: boolean;
  hover?: boolean;
}

const BOARD_SIZE = 9;
const MINES = 10;

class Game extends Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    const gameSize = BOARD_SIZE;

    const squares: SquareData[][] = Array(gameSize);
    for (let i = 0; i < squares.length; i++) {
      squares[i] = Array(gameSize);
      for (let j = 0; j < squares.length; j++) {
        squares[i][j] = {
          id: i * BOARD_SIZE + j,
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

    for (let i = 0; i < gameSize; i++) {
      const iRange = this.findRange(i, gameSize);
      for (let j = 0; j < gameSize; j++) {
        const jRange = this.findRange(j, gameSize);
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
      mines: MINES,
      squaresClicked: 0,
      gameSize: gameSize * gameSize,
      time: 0,
      timerRunning: false,
      timerHandle: 0,
      firstClick: true,
      rightButtonDown: false
    };
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  // Mines are placed after the first click so that the first click, and the
  // squares around it, are always safe.
  placeMines = (
    squares: SquareData[][],
    safeRow: number,
    safeColumn: number
  ) => {
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
    const { iRange: safeI, jRange: safeJ } =
      squares[safeRow][safeColumn].Ranges!;
    let iterator = 0;
    while (iterator < MINES) {
      const i = Math.floor(Math.random() * BOARD_SIZE);
      const j = Math.floor(Math.random() * BOARD_SIZE);
      const isSafe = safeI.includes(i) && safeJ.includes(j);
      if (squares[i][j].bomb === false && !isSafe) {
        squares[i][j].bomb = true;
        iterator++;
      }
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const { iRange, jRange } = squares[i][j].Ranges!;
        let count = 0;
        for (let I = 0; I < iRange.length; I++) {
          for (let J = 0; J < jRange.length; J++) {
            if (squares[iRange[I]][jRange[J]].bomb) {
              count++;
            }
          }
        }
        squares[i][j].display.value = {
          text: count === 0 ? "" : count,
          style: {
            color: colorMap[count],
            background: "rgba(150,150,150,1)",
            borderColor: "#101010",
            borderWidth: "1px"
          }
        };
      }
    }
  };

  findRange = (i: number, gameSize: number) => {
    let range = [i - 1, i, i + 1];
    if (i === 0) {
      range = range.slice(1, 3);
    } else if (i === gameSize - 1) {
      range = range.slice(0, 2);
    }
    return range;
  };

  handleHover = () => {
    this.setState({ hover: !this.state.hover });
  };

  handleLose = () => {
    this.stopTimer();
    const squares = this.state.squares.map(row =>
      row.map(square => {
        if (square.clicked === false && square.bomb && square.flag !== 1) {
          return { ...square, displayIndex: "bomb" as const };
        }
        if (square.flag === 1 && square.bomb === false) {
          return { ...square, displayIndex: "wrong" as const };
        }
        return square;
      })
    );
    const smiley = this.state.smiley;
    smiley.displayIndex = "lose";
    smiley.display["smiley"] = "💀";
    this.setState({ squares: squares, smiley: smiley, lose: true });
  };

  handleWin = () => {
    // put glasses, put flag on all mines disable board
    const smiley = this.state.smiley;
    smiley.displayIndex = "win";
    smiley.display["smiley"] = "😎";
    const squares = this.state.squares.map(row =>
      row.map(square =>
        square.bomb === true
          ? { ...square, displayIndex: "flag" as const }
          : square
      )
    );
    this.stopTimer();
    this.setState({ squares: squares, smiley: smiley, win: true });
  };

  makeSmile = () => {
    const smiley = this.state.smiley;
    smiley.displayIndex = "smiley";
    this.setState({ smiley: smiley });
  };

  handleClick = (id: number) => {
    if (this.state.firstClick) {
      const [row, column] = this.getRowColumn(id);
      this.placeMines(this.state.squares, row, column);
      this.startTimer();
      this.setState({ firstClick: false }, () => {
        this.handleClick(id);
      });
      return;
    }
    if (this.state.rightButtonDown === true) {
      this.handleMouseUp(() => {
        this.handleDoubleClick(id);
      });

      return;
    }
    this.makeSmile();
    const squares = this.state.squares.slice();
    const [row, column] = this.getRowColumn(id);
    const square = squares[row][column];
    if (square.clicked || square.flag === 1 || this.state.lose) {
      return;
    }
    if (square.bomb) {
      square.clicked = true;
      square.displayIndex = "explosion";
      this.handleLose();
      return;
    }
    this.afterReveal(squares, this.reveal(squares, row, column));
  };

  // Reveals a square and, if it has no adjacent mines, everything that opens up
  // around it (breadth-first, so no recursion and no setState per square).
  // Mutates `squares` and returns how many squares were revealed.
  reveal = (squares: SquareData[][], row: number, column: number) => {
    let revealed = 0;
    const queue: [number, number][] = [[row, column]];
    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const square = squares[r][c];
      if (square.clicked || square.flag === 1) {
        continue;
      }
      square.clicked = true;
      square.displayIndex = "value";
      revealed++;
      if (square.display.value.text === "") {
        const { iRange, jRange } = square.Ranges!;
        for (const i of iRange) {
          for (const j of jRange) {
            queue.push([i, j]);
          }
        }
      }
    }
    return revealed;
  };

  afterReveal = (squares: SquareData[][], revealed: number) => {
    const squaresClicked = this.state.squaresClicked + revealed;
    this.setState({ squares: squares, squaresClicked: squaresClicked });
    if (this.state.gameSize - squaresClicked === this.state.mines) {
      this.handleWin();
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

  checkAllAdjacent = (
    row: number,
    column: number,
    method: (row: number, column: number) => number
  ) => {
    const { iRange, jRange } = this.state.squares[row][column].Ranges!;
    let value = 0;
    for (let i = 0; i < iRange.length; i++) {
      for (let j = 0; j < jRange.length; j++) {
        value += method(iRange[i], jRange[j]);
      }
    }
    return value;
  };

  handleContextMenu = (id: number) => {
    const flagMap = ["blank", "flag", "question"] as const;
    const squares = this.state.squares.slice();
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

  handleDoubleClick = (id: number) => {
    const squares = this.state.squares.slice();
    const [row, column] = this.getRowColumn(id);
    if (squares[row][column].clicked === true) {
      const flags = this.checkAllAdjacent(row, column, this.countAdjacentFlags);
      if (flags === squares[row][column].display.value.text) {
        this.chord(squares, row, column);
      }
    }
  };

  // Reveals every unflagged square around a number whose flags add up to it.
  chord = (squares: SquareData[][], row: number, column: number) => {
    const { iRange, jRange } = squares[row][column].Ranges!;
    let revealed = 0;
    let hitMine = false;
    for (const i of iRange) {
      for (const j of jRange) {
        const square = squares[i][j];
        if (square.clicked || square.flag === 1) {
          continue;
        }
        if (square.bomb) {
          square.clicked = true;
          square.displayIndex = "explosion";
          hitMine = true;
        } else {
          revealed += this.reveal(squares, i, j);
        }
      }
    }
    if (hitMine) {
      this.handleLose();
    } else {
      this.afterReveal(squares, revealed);
    }
  };

  countAdjacentFlags = (row: number, column: number) => {
    const squares = this.state.squares;
    let flags = 0;
    if (squares[row][column].flag === 1) {
      flags++;
    }
    return flags;
  };

  getRowColumn = (id: number) => {
    const row = Math.floor(id / BOARD_SIZE);
    const column = id % BOARD_SIZE;
    return [row, column];
  };

  handleMouseDown = (event: React.MouseEvent) => {
    const smiley = this.state.smiley;
    smiley.displayIndex = "worried";
    if (event.button === 2) {
      this.setState({ rightButtonDown: true });
    }
    this.setState({ smiley: smiley });
  };

  handleMouseUp = (callback?: () => void) => {
    this.makeSmile();
    if (typeof callback !== "undefined") {
      this.setState({ rightButtonDown: false }, callback);
    } else {
      this.setState({ rightButtonDown: false });
    }
  };

  render() {
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
            onMouseUp={this.handleMouseUp}
          />
        </div>
      </div>
    );
  }
}

export default Game;
