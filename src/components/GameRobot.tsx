
import React, { useState, useEffect } from 'react';
import '../assets/StylesGameRobot.css';
import { Link } from 'react-router-dom';

function GameRobot(): JSX.Element {
  const [userChoice, setUserChoice] = useState<string>('rock');
  const [computerChoice, setComputerChoice] = useState<string>('rock');
  const [userPoints, setUserPoints] = useState<number>(0);
  const [computerPoints, setComputerPoints] = useState<number>(0);
  const [turnResult, setTurnResult] = useState<string | null>(null);
  const [result, setResult] = useState<string>('Let\'s see who wins');
  const [gameOver, setGameOver] = useState<boolean>(false);

  const choices: string[] = ['rock', 'paper', 'scissors'];

  const handleOnClick = (choice: string): void => {
    setUserChoice(choice);
    generateComputerChoice();
  };

  const generateComputerChoice = (): void => {
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    setComputerChoice(randomChoice);
  };

  const reset = (): void => {
    window.location.reload();
  };

  useEffect(() => {
    const comboMoves = userChoice + computerChoice;
    if (userPoints <= 4 && computerPoints <= 4) {
      if (
        comboMoves === 'rockscissors' ||
        comboMoves === 'paperrock' ||
        comboMoves === 'scissorspaper'
      ) {
        const updatedUserPoints = userPoints + 1;
        setUserPoints(updatedUserPoints);
        setTurnResult('User got the point');
        if (updatedUserPoints === 5) {
          setGameOver(true);
          setResult('User wins!!!');
        }
      }

      if (
        comboMoves === 'paperscissors' ||
        comboMoves === 'scissorsrock' ||
        comboMoves === 'rockpaper'
      ) {
        const updatedComputerPoints = computerPoints + 1;
        setComputerPoints(updatedComputerPoints);
        setResult('Computer got the point');
        if (updatedComputerPoints === 5) {
          setGameOver(true);
          setResult('Computer wins');
        }
      }
    }

    if (
      comboMoves === 'rockrock' ||
      comboMoves === 'paperpaper' ||
      comboMoves === 'scissorsscissors'
    ) {
      setTurnResult('No one got the point');
    }
  }, [userChoice, computerChoice, userPoints, computerPoints]);

  return (
    <div className="App">
      <h1 className='heading'>Rock Paper Scissors</h1>
      <div className='score'>
        <h1 className='h1-score1'>User Points: {userPoints}</h1>
        <h1 className='h1-score2'>Computer Points: {computerPoints}</h1>
      </div>
      <div className='choice'>
        <div className='choice-user'>
          <img className='user-hand' src={`../images/${userChoice}.png`} alt="" />
        </div>
        <div className='choice-computer'>
          <img className='computer-hand' src={`../images/${computerChoice}.png`} alt="" />
        </div>
      </div>
      
      <div className="button-div">
        {!gameOver &&
          choices.map((choice, index) => (
            <button className="button" key={choice} onClick={() => handleOnClick(choice)}>
              {choice}
            </button>
          ))}
      </div>

      <div className='result'>
        <h1>Turn Result: {turnResult}</h1>
        <h1>Final Result: {result}</h1>
      </div>
      <div className='button-div'>
        {gameOver && 
          <button className='button' onClick={() => reset()}>Restart Game</button>
        }
      </div>

      <div className='play-online-btn'>
        <button className='play-online-button'>
          <Link to="/online">Play Online</Link>
        </button>
      </div>
    </div>
  );
}

export default GameRobot;
