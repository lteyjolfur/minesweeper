import React, { Component } from "react";

class SevenSeg extends Component {
  constructor() {
    super();
    {
      let segments = [];
      for (let i = 0; i < 7; i++) {
        let styles = {};
        if (i === 3) {
          //styles.className = () => {
          //this.pickClassHexagon();
          styles.className = () => {
            return this.pickClassHexagon();
          };
          //};
          styles.style = () => {
            return { top: "-100px", left: "4px" };
          };
        } else {
          styles.className = () => {
            return "trapezoid segment" + i;
          };
          styles.style = () => {
            return { borderBottomColor: this.pickColor(i) };
          };
        }
        segments.push(styles);
      }
      const decTo7 = [
        [true, true, true, false, true, true, true], // 0
        [false, false, true, false, false, true, false], // 1
        [true, false, true, true, true, false, true], // 2
        [true, false, true, true, false, true, true], // 3
        [false, true, true, true, false, true, false], // 4
        [true, true, false, true, false, true, true], // 5
        [true, true, false, true, true, true, true], // 6
        [true, false, true, false, false, true, false], // 7
        [true, true, true, true, true, true, true], // 8
        [true, true, true, true, false, true, true], // 9
        [false, false, false, true, false, false, false] // -
      ];
      this.state = { segments: segments, decTo7: decTo7 };
    }
  }

  decode = number => {
    return this.state.decTo7[number];
  };

  pickColor = segment => {
    if (this.decode(this.props.number)[segment]) {
      return "red";
    } else {
      return "#4a0002";
    }
  };

  pickClassHexagon = () => {
    if (this.decode(this.props.number)[3]) {
      return "hexagon-on";
    } else {
      return "hexagon";
    }
  };

  render() {
    let iterator = 0;

    return (
      <div className="SevenSeg">
        {" "}
        {this.state.segments.map((curSeg, index) => {
          return (
            <div
              key={iterator++}
              className={curSeg.className()}
              style={curSeg.style()}
            ></div>
          );
        })}
      </div>
    );
  }
}

export default SevenSeg;
