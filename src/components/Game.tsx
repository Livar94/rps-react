import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/StylesGame1.css';

interface GameInfo {
  gameId: string;
  playerOne: {
    playerId: string;
    playerName: string;
  };
}

interface GameData {
  playerOne: string;
  playerTwo: string;
  status: string;
  playerOneWins: number;
  playerTwoWins: number;
  playerOneMove: string;
  playerTwoMove: string;
}

function getChoiceImageURL(choice: string): string {
  return `../images/${choice.toLowerCase()}.png`;
}

function Game(): JSX.Element {
  const location = useLocation();
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [user2Choice, setUser2Choice] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const gameInfo = location.state && location.state.data as GameInfo;
  const choices: string[] = ['ROCK', 'PAPER', 'SCISSORS'];
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [user1Label, setUser1Label] = useState<string>('');
  const [user2Label, setUser2Label] = useState<string>('');
  const [userScore, setUserScore] = useState<number>(0);
  const [user2Score, setUser2Score] = useState<number>(0);
  const [result_p, setResult_p] = useState<string>('');
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [movesMade, setMovesMade] = useState<boolean>(false);
  const [userMove, setUserMove] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => {
      fetchGameInfo();
    }, 1000);

    setIntervalId(id);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  useEffect(() => {
    console.log(gameInfo);
  }, [gameInfo]);

  const reset = () => {
    window.location.reload();
  };

  function fetchGameInfo() {
    if (!gameInfo) return;

    fetch(`http://localhost:8080/api/games/${gameInfo?.gameId}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: gameInfo?.playerOne?.playerId,
      }),
    })
      .then((response) => response.json())
      .then((data: GameData) => {
        setGameData(data);

        if (gameInfo?.playerOne?.playerName === data?.playerOne) {
          setUser1Label(gameInfo?.playerOne?.playerName);
          setUser2Label(data?.playerTwo);
        } else {
          setUser1Label(data?.playerOne);
          setUser2Label(gameInfo?.playerOne?.playerName);
        }
        setUserScore(data?.playerOneWins);
        setUser2Score(data?.playerTwoWins);

        if (data?.playerOneMove && data?.playerTwoMove) {
          setUserChoice(
            gameInfo?.playerOne?.playerName === data?.playerOne
              ? data?.playerOneMove.toLowerCase()
              : data?.playerTwoMove.toLowerCase()
          );
          setUser2Choice(
            gameInfo?.playerOne?.playerName === data?.playerOne
              ? data?.playerTwoMove.toLowerCase()
              : data?.playerOneMove.toLowerCase()
          );

          setMovesMade(true);
          setUserMove(null);

          if (gameInfo?.playerOne?.playerName === data?.playerOne) {
            setResult_p(`You ${data?.playerOneMove}, ${data?.playerTwo} ${data?.playerTwoMove}`);
          } else {
            setResult_p(`You ${data?.playerTwoMove}, ${data?.playerOne} ${data?.playerOneMove}`);
          }
        } else {
          setMovesMade(false);
        }

        if (data?.status === 'PLAYER_ONE_IS_THE_WINNER' || data?.status === 'PLAYER_TWO_IS_THE_WINNER') {
          setGameOver(true);
          setResult_p(data?.status === 'PLAYER_ONE_IS_THE_WINNER' ? `${data?.playerOne.toUpperCase()} IS THE WINNER!!!` : `${data?.playerTwo.toUpperCase()} IS THE WINNER!!!`);
        }
      })
      .catch((error) => {
        console.log(error, 'fetchGameInfo');
      });
  }

  function makeMove(move: string) {
    console.log('User made move:', move);

    setGameOver(false);
    setMovesMade(false);

    if (!gameInfo) return;

    fetch(`http://localhost:8080/api/games/move`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: gameInfo?.playerOne?.playerId,
        gameId: gameInfo?.gameId,
        playerMove: move,
      }),
    })
      .then((response) => response.json())
      .then((data: GameData) => {
        setGameData(data);
        console.log(gameInfo, 'Moved');
        setUserMove(move);
      })
      .catch((error) => {
        console.log(error, 'makeMove');
      });
  }

  return (
    <div className="App">
    <div className='rock-paper-heading'>
      <h1 className='heading'>Rock Paper Scissors</h1>
    </div>
    <div className='score'>
      
      <h1 className='score-user1'>{user1Label} : {userScore}</h1>
      <h1 className='score-user2'>{user2Label}: {user2Score}</h1>
    </div>
  

<div className='choice'>
<div className='choice-user1'>
  {userChoice && <img className='user1-hand' src={getChoiceImageURL(userChoice)} alt="" />}
</div>
<div className='choice-user2'>
  {user2Choice && <img className='user2-hand' src={getChoiceImageURL(user2Choice)} alt="" />}
</div>
</div>
{!gameOver && <div className='button-div'>
{choices.map((choice, index) => (
  <button className="button" key={choice} onClick={() => makeMove(choice)}>
    <img src={getChoiceImageURL(choice)} alt={choice} />
  </button>
))}
</div> }




<div className='finalResult'>
{gameOver && <h1>{result_p}</h1>}
{!gameOver && movesMade && <h1>{result_p}</h1>}
{!gameOver && !movesMade && userMove && <h1>You {userMove}</h1>}

</div>


<div className='button-div'>
{gameOver && <button className='button' onClick={() => navigate('/')}>Restart Game</button>}
</div>
  </div>
  );
}

export default Game;
