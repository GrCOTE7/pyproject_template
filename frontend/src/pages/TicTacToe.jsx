import { useState, useEffect } from "react";
import { setDocumentTitle } from "../utils/documentTitle";

import "../assets/styles_tictactoe.css";

// Réf.: https://fr.react.dev/learn/tutorial-tic-tac-toe
// * [ ] Autre façon de faire : https://fr.react.dev/learn/describing-the-ui

// https://fljx7g.csb.app
// → https://codesandbox.io/p/sandbox/react-dev-forked-fljx7g

function Square({ value, onSquareClick, className = "" }) {
  return (
    <button className={`square ${className}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  // const [xIsNext, setXIsNext] = useState(true);
  // const [squares, setSquares] = useState(Array(9).fill(null));

  // function handleClick(i) {
  //   setSquares((prev) => {
  //     const next = [...prev];
  //     next[i] = "X";
  //     console.log(next);
  //     return next;
  //   });
  // }

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }
    // const nextSquares = squares.slice();
    const nextSquares = [...squares]; // + moderne
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
    // setSquares(nextSquares);
    console.log(nextSquares); // aff en double en dev // StrictMode
    // setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  const winningSquares = winner ? winner[1] : [];
  let status;
  if (winner) {
    status = winner[0] + " a gagné";
  } else if (squares.includes(null)) {
    status = "Prochain tour : " + (xIsNext ? "X" : "O");
  } else {
    status = "Match null";
  }
  console.log("square:", squares);
  // Ci-dessous fctn fléchée {() => handleClick(0)} permet d'appeler la fonction au lieu de simplement la transmettre
  return (
    <>
      <div className="status">{status}</div>

      {[0, 1, 2].map((row) => (
        <div key={row} className="board-row">
          {[0, 1, 2].map((col) => {
            const i = row * 3 + col;
            return (
              <Square
                key={i}
                value={squares[i]}
                className={winningSquares.includes(i) ? "win" : ""}
                onSquareClick={() => handleClick(i)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log("Gagné par " + squares[a]);
      return [squares[a], lines[i]];
    }
  }
  return null;
}

export default function TicTacToe() {
  // const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  // const currentSquares = history[history.length - 1];
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    // setHistory([...history, nextSquares]);
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    // setXIsNext(!xIsNext);
    console.log([...history]);
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Aller au coup #" + move;
    } else {
      description = "Revenir au début";
    }
    return (
      <li key={move}>
        {move + 1}{" "}
        <button className="history" onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    // setXIsNext(nextMove % 2 === 0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {/* <ol>{[1, 2, 3].map((x) => x * 2).join(", ")}</ol> */}
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
