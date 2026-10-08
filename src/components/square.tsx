import { Component } from "react";
import { SquareData } from "./types";

interface SquareProps {
  square: SquareData;
  onHover: () => void;
  onClick: (id: number, event: React.MouseEvent) => void;
  onContextMenu: (id: number, event: React.MouseEvent) => void;
  onDoubleClick: (id: number, event: React.MouseEvent) => void;
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseUp: () => void;
}

class Square extends Component<SquareProps> {
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
          onMouseEnter={this.props.onHover}
          onMouseLeave={this.props.onHover}
          onContextMenu={event => {
            event.preventDefault();
            this.props.onContextMenu(this.props.square.id, event);
          }}
          onMouseDown={event => {
            this.props.onMouseDown(event);
          }}
          onMouseUp={this.props.onMouseUp}
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
