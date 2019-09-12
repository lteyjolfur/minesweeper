import React, { Component } from "react";
import SevenSeg from "./sevenSeg";

class Counter extends Component {
  getFirstDec() {
    const number = this.props.number;
    if (number >= 0) {
      return Math.floor(number / 100);
    } else {
      return 10; // 10 makes a minus
    }
  }
  getSecondDec() {
    const number = Math.abs(this.props.number);
    return Math.floor((Math.abs(number) % 100) / 10);
  }
  getThirdDec() {
    const number = Math.abs(this.props.number);
    return Math.floor(number % 10);
  }

  render() {
    //console.log(this.props.number);
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
