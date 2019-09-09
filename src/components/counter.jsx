import React, { Component } from "react";
import SevenSeg from "./sevenSeg";

class Counter extends Component {
  getFirstDec() {
    return Math.floor(this.props.number / 100);
  }
  getSecondDec() {
    return Math.floor((this.props.number % 100) / 10);
  }
  getThirdDec() {
    return Math.floor(this.props.number % 10);
  }

  render() {
    console.log(this.props.number);
    return (
      <div
        style={{
          float: this.props.float,
          border: "3px solid black",
          borderBottomColor: "wheat",
          borderRightColor: "wheat",
          height: "75px",
          width: "123px",
          marginTop: "12px",
          marginLeft: "15px",
          marginRight: "15px"
        }}
      >
        <SevenSeg number={this.getFirstDec()} />
        <SevenSeg number={this.getSecondDec()} />
        <SevenSeg number={this.getThirdDec()} />
      </div>
    );
  }
}

export default Counter;
