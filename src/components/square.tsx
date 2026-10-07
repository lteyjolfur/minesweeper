import React, { Component } from "react";

class Square extends Component {
  state = {
    hover: false
  };

  render() {
    return (
      <span>
        <button
          onClick={event => {
            this.props.onClick(this.props.square.id, event);
          }}
          onDoubleClick={event => {
            this.props.onDoubleClick(this.props.square.id, event);
          }}
          onMouseEnter={this.onHover}
          onMouseLeave={this.onHover}
          onContextMenu={event => {
            event.preventDefault();
            this.props.onContextMenu(this.props.square.id, event);
          }}
          onMouseDown={event => {
            this.props.onMouseDown(event);
          }}
          onMouseUp={this.props.onMouseup}
          className=" btn btn-secondary square square-small"
          style={
            this.props.square.display[this.props.square.displayIndex].style
          }
        >
          {this.props.square.display[this.props.square.displayIndex].text}
        </button>
      </span>
    );
  }
}

export default Square;
