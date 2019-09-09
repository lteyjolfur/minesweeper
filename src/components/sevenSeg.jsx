import React, { Component } from "react";

class SevenSeg extends Component {
  state = { number: 1 };

  decode = number => {
    const decTo7 = [
      [0, 1, 2, 3, 4, 5],
      [1, 2],
      [0, 1, 3, 4, 6],
      [0, 1, 2, 3, 6],
      [1, 2, 5, 6],
      [0, 2, 3, 5, 6],
      [0, 2, 3, 4, 5, 6],
      [0, 1, 2],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 1, 2, 3, 5, 6]
    ];
    return decTo7[number];
  };

  render() {
    return (
      <div className="SevenSeg">
        {" "}
        {this.state.number}
        <div className="hexagon"></div>
      </div>
    );
  }
}

export default SevenSeg;
