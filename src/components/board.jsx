import React, { Component } from "react";
import Square from "./square";
//import { classMethod } from "@babel/types";

class Board extends Component {
  render() {
    //console.log(this.state.squares);
    let index = 0;
    const { win, lose } = this.props;
    return (
      <div
        style={{
          pointerEvents: lose || win ? "none" : "auto"
        }}
      >
        {this.props.squares.map(row => (
          <div key={"div" + index++}>
            {row.map(square => (
              <Square
                key={square.id}
                square={square}
                onHover={this.props.onHover}
                onClick={this.props.onClick}
                onContextMenu={this.props.onContextMenu}
                onDoubleClick={this.props.onDoubleClick}
                onMouseDown={event => {
                  this.props.onMouseDown(event);
                }}
                onMouseUp={this.props.onMouseup}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default Board;
