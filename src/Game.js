import { useState } from 'react';
import ReactSwitch from 'react-switch';

function Square({ value, isHighlight, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick} style={isHighlight ? {'color': 'red'} : {}}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  const winner = calculateWinner(squares);
  let status;
  if (winner[0]) {
    status = "Winner:" + winner[0];
  } else {
    status = "Next:" + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || winner[0]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    
    onPlay(nextSquares);
  }

  let square_sides = [0, 1, 2];
  return (
    <>
      <div className="current-move">Your are at move #{currentMove}</div>
      <div className="status">{status}</div>
      { square_sides.map((side) => (
        <div className="board-row">
          {square_sides.map((square) => (
            <Square key={side + square} value={squares[side*3 + square]} isHighlight={winner[1] && winner[1].includes(side*3 + square)} onSquareClick={() => handleClick(side*3 + square)} />
          ))}
        </div>
      ))}
    </>
  );
}

function changedIndex(prevSquare, square) {
  for (let i = 0; i < prevSquare.length; i++) {
    if (prevSquare[i] !== square[i]) {
      return i;
    }
  }
  return null;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return [squares[a], lines[i]]
    }
  }
  
  return [];
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [checked, setChecked] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const handleToggleChange = val => {
    setChecked(val);
  };

  let prevSquare = [];
  const moves = history.map((square, move) => {
    let description;
    if (move > 0) {
      let index = changedIndex(prevSquare, square);
      let column = index%3 + 1;
      let row = Math.floor(index/3) + 1;
      description = "Go to move # " + move + "(" + row + "x" + column + ")";
    } else {
      description = "Go to game start";
    }
    prevSquare = square;
    return (
      <>
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      </>
    );
  });
  let sortedMoves = moves;
  if (checked) {
    sortedMoves = moves.reverse();
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className='game-info'>
        <ReactSwitch checked={checked} onChange={handleToggleChange} />
        <ol>
          {sortedMoves}
        </ol>
      </div>
    </div>
  );
}
