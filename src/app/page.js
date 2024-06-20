"use client";
import { Gaegu } from "next/font/google";
import { useState } from "react";

export default function Game () {
  const [gameHistory, setGameHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = (currentMove % 2 == 0);
  const currentSquareData = gameHistory[currentMove];

  function handlePlays (newBoardState) {
    const nextHistory = [...gameHistory.slice(0,currentMove + 1), newBoardState];
    setGameHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  function jumpTo (nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = gameHistory.map((squares, moveIdx) => {
    let description;
    if (moveIdx > 0) {
      description = "Go to move " + moveIdx;
    } else {
      description = "Go to beginning";
    }
    return <li key={moveIdx + Math.random}>
      <button onClick={() => jumpTo(moveIdx)}>{description}</button>
    </li>
  })

  return (<div className="game">
    <div classname="gameBoard">
      <Board squareData={currentSquareData} isX={xIsNext} onPlay={handlePlays}/>
    </div>
    <div className="gameInfo">
      <ol>{moves}</ol>
    </div>
  </div>);
}

function Board ({ squareData, isX, onPlay}) {
  function onSquareClick (index) {
    let char = isX ? "X" : "O";
    const newSquareData = squareData.slice();
    
    if(!hasWinner() && !newSquareData[index]){
      newSquareData[index] = char;
      onPlay(newSquareData);
    }
  }

  const winner = hasWinner();

  function hasWinner () {
    let winningCombos = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ]

    for (let i = 0; i < winningCombos.length; i ++) {
      const [a,b,c] = winningCombos[i];
      
      if (squareData[a] && squareData[a] === squareData[b] && squareData[b] === squareData[c]){
        if (squareData[a] === "X") return "X";
        if (squareData[a] === "O") return "O";
      } 
    }
    return null;
  }


  return (<>
  <div className="nextPlayer">{winner ? (<h3>{winner} has won!</h3>) : (<h3>Next Player: {isX ? "X": "O"}</h3>)}</div>
  <div className="boardRow">
    {
      [0,1,2].map( (idx) => {
        return (<Square key ={idx} value={squareData[idx]} onClick={() => onSquareClick(idx)}/>);
      })
    }
  </div>
  <div className="boardRow">
    {
      [3,4,5].map( (idx) => {
        return (<Square key ={idx} value={squareData[idx]} onClick={() => onSquareClick(idx)}/>);
      })
    }
  </div>
  <div className="boardRow">
    {
      [6,7,8].map( (idx) => {
        return (<Square key ={idx} value={squareData[idx]} onClick={() => onSquareClick(idx)}/>);
      })
    }
  </div>
  </>);
}

function Square ({value, onClick}) {
  return <button className="square" onClick={onClick}>{value}</button>
}