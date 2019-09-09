import React, { Component } from "react";
import SevenSeg from "./sevenSeg";

class Counter extends Component {
  state = {};
  render() {
    return (
      <div
        style={{
          //display: "inline",
          float: this.props.float,
          border: "3px solid black",
          borderBottomColor: "wheat",
          borderRightColor: "wheat",
          height: "75px",
          width: "140px",
          marginTop: "12px"
        }}
      >
        <SevenSeg />
        <SevenSeg />
        <SevenSeg />
      </div>
    );
  }
}

export default Counter;
