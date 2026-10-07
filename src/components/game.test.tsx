import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen
} from "@testing-library/react";
import App from "../App";

// Deterministic Math.random (mulberry32) so mine layouts are repeatable.
function seed(value: number) {
  let a = value;
  vi.spyOn(Math, "random").mockImplementation(() => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  });
}

// Which segments (top, top-left, top-right, middle, bottom-left, bottom-right,
// bottom) are lit for each digit; the same table the display uses.
const DIGITS = [
  "1110111",
  "0010010",
  "1011101",
  "1011011",
  "0111010",
  "1101011",
  "1101111",
  "1010010",
  "1111111",
  "1111011",
  "0001000"
];

function readCounter(index: number) {
  const digits = Array.from(document.querySelectorAll(".SevenSeg")).slice(
    index * 3,
    index * 3 + 3
  );
  const text = digits
    .map(digit => {
      const lit = Array.from(digit.children)
        .map(seg =>
          seg.className.includes("hexagon-on") ||
          (seg as HTMLElement).style.borderBottomColor === "red"
            ? "1"
            : "0"
        )
        .join("");
      const value = DIGITS.indexOf(lit);
      return value === 10 ? "-" : String(value);
    })
    .join("");
  return text;
}

const squares = () =>
  screen
    .getAllByRole("button")
    .filter(b => b.className.includes("square-small"));
const smiley = () =>
  screen.getAllByRole("button").find(b => b.className.includes("square-big"))!;
const isRevealed = (i: number) =>
  squares()[i].style.borderColor === "rgb(16, 16, 16)" ||
  squares()[i].style.borderColor === "black";
// A real click is mousedown, mouseup, click.
const clickAt = (row: number, col: number) => {
  const square = squares()[row * 9 + col];
  fireEvent.mouseDown(square);
  fireEvent.mouseUp(square);
  fireEvent.click(square);
};

beforeEach(() => {
  // the timer would otherwise keep running between tests
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Minesweeper", () => {
  it("renders a 9x9 board with 10 mines left and a smiley", () => {
    render(<App />);
    expect(squares()).toHaveLength(81);
    expect(smiley().textContent).toBe("🙂");
    expect(readCounter(0)).toBe("010");
    expect(readCounter(1)).toBe("000");
  });

  it("reveals a square when clicked", () => {
    seed(1);
    render(<App />);
    clickAt(4, 4);
    expect(isRevealed(40)).toBe(true);
  });

  it("never loses on the first click, wherever it is (15 games)", () => {
    for (let game = 0; game < 15; game++) {
      seed(game);
      render(<App />);
      clickAt(game % 9, (game * 4) % 9);
      expect(smiley().textContent).toBe("🙂");
      cleanup();
      vi.restoreAllMocks();
    }
  });

  it("cycles flag, question mark and blank, and counts only flags", () => {
    render(<App />);
    const square = squares()[0];
    fireEvent.contextMenu(square);
    expect(squares()[0].textContent).toBe("⛳");
    expect(readCounter(0)).toBe("009");
    fireEvent.contextMenu(squares()[0]);
    expect(squares()[0].textContent).toBe("❓");
    expect(readCounter(0)).toBe("010");
    fireEvent.contextMenu(squares()[0]);
    expect(squares()[0].textContent).toBe("");
    expect(readCounter(0)).toBe("010");
  });

  it("goes negative when there are more flags than mines", () => {
    render(<App />);
    for (let i = 0; i < 11; i++) fireEvent.contextMenu(squares()[i]);
    expect(readCounter(0)).toBe("-01");
  });

  it("does not reveal a flagged square", () => {
    seed(1);
    render(<App />);
    fireEvent.contextMenu(squares()[0]);
    clickAt(0, 0);
    expect(squares()[0].textContent).toBe("⛳");
  });

  it("counts seconds once the game has started", () => {
    seed(1);
    render(<App />);
    act(() => vi.advanceTimersByTime(3000));
    expect(readCounter(1)).toBe("000");
    clickAt(4, 4);
    for (let i = 0; i < 3; i++) act(() => vi.advanceTimersByTime(1000));
    expect(readCounter(1)).toBe("003");
  });

  it("looks worried while the mouse is down and relaxes on release", () => {
    seed(1);
    render(<App />);
    fireEvent.mouseDown(squares()[40]);
    expect(smiley().textContent).toBe("😯");
    fireEvent.mouseUp(squares()[40]);
    expect(smiley().textContent).toBe("🙂");
  });

  it("starts a new game when the smiley is clicked", () => {
    seed(1);
    render(<App />);
    fireEvent.contextMenu(squares()[0]);
    clickAt(4, 4);
    fireEvent.click(smiley());
    expect(squares()[0].textContent).toBe("");
    expect(readCounter(0)).toBe("010");
  });

  describe("ending the game", () => {
    // Lose on purpose to learn where the mines are for this seed.
    function findMines(gameSeed: number) {
      seed(gameSeed);
      render(<App />);
      clickAt(4, 4);
      let guard = 0;
      while (smiley().textContent !== "💀" && guard++ < 81) {
        const hidden = squares().findIndex(s => s.textContent === "");
        fireEvent.click(squares()[hidden]);
      }
      const mines = squares()
        .map((s, i) =>
          s.textContent === "💣" || s.textContent === "💥" ? i : -1
        )
        .filter(i => i >= 0);
      cleanup();
      vi.restoreAllMocks();
      return mines;
    }

    it("shows every mine and 💀 after hitting one", () => {
      const mines = findMines(7);
      expect(mines).toHaveLength(10);
      seed(7);
      render(<App />);
      clickAt(4, 4);
      fireEvent.click(squares()[mines[0]]);
      expect(smiley().textContent).toBe("💀");
      expect(squares()[mines[0]].textContent).toBe("💥");
      expect(squares()[mines[1]].textContent).toBe("💣");
    });

    it("marks a wrongly placed flag with ❌ after a loss", () => {
      const mines = findMines(7);
      seed(7);
      render(<App />);
      clickAt(4, 4);
      const safe = squares().findIndex(
        (s, i) => s.textContent === "" && !mines.includes(i)
      );
      fireEvent.contextMenu(squares()[safe]);
      fireEvent.click(squares()[mines[0]]);
      expect(squares()[safe].textContent).toBe("❌");
    });

    it("shows 😎 and flags every mine once all safe squares are open", () => {
      const mines = findMines(7);
      seed(7);
      render(<App />);
      clickAt(4, 4);
      squares().forEach((_, i) => {
        if (!mines.includes(i)) fireEvent.click(squares()[i]);
      });
      expect(smiley().textContent).toBe("😎");
      for (const i of mines) expect(squares()[i].textContent).toBe("⛳");
    });

    it("chords: reveals the neighbours of a number whose flags match", () => {
      const mines = findMines(7);
      seed(7);
      render(<App />);
      clickAt(4, 4);
      // find a revealed number next to exactly one mine, flag it, chord
      const around = (i: number) =>
        [-10, -9, -8, -1, 1, 8, 9, 10]
          .map(d => i + d)
          .filter(
            j =>
              j >= 0 &&
              j < 81 &&
              Math.abs((j % 9) - (i % 9)) <= 1 &&
              Math.abs(Math.floor(j / 9) - Math.floor(i / 9)) <= 1
          );
      const target = squares().findIndex(
        (s, i) =>
          s.textContent === "1" &&
          around(i).filter(j => mines.includes(j)).length === 1 &&
          around(i).some(
            j => !mines.includes(j) && squares()[j].textContent === ""
          )
      );
      expect(target).toBeGreaterThanOrEqual(0);
      const mine = around(target).find(j => mines.includes(j))!;
      fireEvent.contextMenu(squares()[mine]);
      fireEvent.doubleClick(squares()[target]);
      for (const j of around(target)) {
        if (!mines.includes(j)) expect(isRevealed(j)).toBe(true);
      }
      expect(smiley().textContent).not.toBe("💀");
    });
  });
});
