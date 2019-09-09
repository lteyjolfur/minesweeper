import React, { Component } from "react";

class SevenSeg extends Component {
  decode = number => {
    const decTo7 = [
      [true, true, true, true, true, true, false],
      [false, true, true, false, false, false, false],
      [true, true, false, true, true, false, true],
      [true, true, true, true, false, false, true],
      [false, true, true, false, false, true, true],
      [true, false, true, true, false, true, true],
      [true, false, true, true, true, true, true],
      [true, true, true, false, false, false, false],
      [true, true, true, true, true, true, true],
      [true, true, true, true, false, true, true]
    ];
    return decTo7[number];
  };

  pickColor = number => {
    if (this.decode(this.props.number)[number]) {
      return "red";
    } else {
      return "#4a0002";
    }
  };

  render() {
    let iterator = 0;
    return (
      <div className="SevenSeg">
        {" "}
        <div
          className="trapezoid"
          style={{
            transform: "rotate(180deg)",
            left: "5px",
            top: "2px",
            borderBottomColor: this.pickColor(0)
          }}
        ></div>
        <div
          className="trapezoid"
          style={{
            transform: "rotate(90deg)",
            left: "-7px",
            top: "6px",
            borderBottomColor: this.pickColor(5)
          }}
        ></div>
        <div
          className="trapezoid"
          style={{
            transform: "rotate(270deg)",
            left: "17px",
            top: "-3px",
            borderBottomColor: this.pickColor(1)
          }}
        ></div>
        <div>
          <div
            className={
              this.decode(this.props.number)[6] ? " hexagon-on" : "hexagon"
            }
            style={{
              top: "-100px",
              left: "4px"
            }}
          ></div>
        </div>
        <div
          className="trapezoid"
          style={{
            transform: "rotate(90deg)",
            top: "-197px",
            left: "-7px",
            borderBottomColor: this.pickColor(4)
          }}
        ></div>
        <div
          className="trapezoid"
          style={{
            transform: "rotate(270deg)",
            top: "-206px",
            left: "17px",
            borderBottomColor: this.pickColor(2)
          }}
        ></div>
        <div
          className="trapezoid"
          style={{
            top: "-203px",
            left: "5px",
            borderBottomColor: this.pickColor(3)
          }}
        ></div>
      </div>
    );
  }
}

export default SevenSeg;
