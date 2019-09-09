import React, { Component } from "react";

class Square extends Component {
  state = {
    hover: false
  };

  render() {
    return (
      <span>
        <button
          onClick={() => {
            this.props.onClick(this.props.square.id);
          }}
          onDoubleClick={() => {
            this.props.onDoubleClick(this.props.square.id);
          }}
          onMouseEnter={this.onHover}
          onMouseLeave={this.onHover}
          onContextMenu={e => {
            e.preventDefault();
            this.props.onContextMenu(this.props.square.id);
          }}
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
