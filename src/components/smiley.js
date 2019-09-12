import React, { Component } from "react";
//import { directive } from "@babel/types";

class Smiley extends Component {
  render() {
    return (
      <div
        style={{
          display: "inline-block",
          marginLeft: "10",
          background: "white",
          border: "3px solid black",
          height: "78px !important",
          width: "78px",
          marginTop: "12px"
        }}
      >
        <button
          className="btn btn-secondary square square-big "
          onClick={this.props.onClick}
          style={{
            height: "72px !important",
            fontSize: 40,
            padding: 0
            //whiteSpace: "nowrap",
          }}
        >
          {this.props.smiley.display[this.props.smiley.displayIndex]}
        </button>
      </div>
    );
  }
}

export default Smiley;
