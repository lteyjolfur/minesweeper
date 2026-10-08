import { Component } from "react";
import Square from "./square";
import { SquareData } from "./types";

interface BoardProps {
  squares: SquareData[][];
  win: boolean;
  lose: boolean;
  onHover: () => void;
  onClick: (id: number, event?: React.MouseEvent) => void;
  onContextMenu: (id: number, event?: React.MouseEvent) => void;
  onDoubleClick: (id: number, event?: React.MouseEvent) => void;
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseUp: () => void;
}

class Board extends Component<BoardProps> {
  render() {
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
                onMouseUp={this.props.onMouseUp}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default Board;
