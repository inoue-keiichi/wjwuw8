import { useState } from "react";

const Square = ({ value, highlight, onSquareClick }) => {
  return (
    <button
      className={highlight ? "square-highlight" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
};

const Board = ({ xIsNext, squares, onPlay }) => {
  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)[0]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    const row = Math.floor(i / 3);
    const col = i % 3;
    onPlay({ nextSquares, col, row });
  };

  const [winner, line] = calculateWinner(squares);
  const status =
    winner === null
      ? `Next player: ${xIsNext ? "X" : "O"}`
      : winner === "draw"
      ? "Draw"
      : `Winner: ${winner}`;

  const createRow = (row, highlightLine) => {
    const highlightPositions = highlightLine.map((e) => {
      return { col: e % 3, row: Math.floor(e / 3) };
    });
    return Array(3)
      .fill(null)
      .map((_, column) => {
        const i = row * 3 + column;
        return (
          <Square
            key={`column_${column}_row_${row}`}
            highlight={highlightPositions.find(
              (position) => position.col === column && position.row === row
            )}
            value={squares[i]}
            col={column}
            row={row}
            onSquareClick={() => handleClick(i)}
          />
        );
      });
  };

  const rows = Array(3)
    .fill(null)
    .map((_, row) => (
      <div className="board-row" key={`row_${row}`}>
        {createRow(row, line)}
      </div>
    ));

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
};

const calculateWinner = (squares) => {
  if (!squares.includes(null)) {
    return ["draw", []];
  }

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], line];
    }
  }
  return [null, []];
};

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), col: -1, row: -1 },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const [isListAsc, setIsListAsc] = useState(true);

  const handlePlay = ({ nextSquares, col, row }) => {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, col, row },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
  };

  const moves = history.map((h, move) => {
    if (move === history.length - 1) {
      return <li key={move}>{`You are at move #${move}`}</li>;
    }

    const description = move > 0 ? `Go to move # ${move}` : `Go to game start`;
    const { col, row } = h;
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
        {move === 0 || `(${col}, ${row})`}
      </li>
    );
  });

  const sortedMoves = moves.slice().sort((a, b) => {
    if (isListAsc) {
      return a.key - b.key;
    } else {
      return b.key - a.key;
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <input
          type="checkbox"
          defaultChecked={isListAsc}
          onChange={(_) => setIsListAsc(!isListAsc)}
        />
        {isListAsc ? "Asc" : "Desc"}
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}
