import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import '../assets/StylesGame1.css';
import { useNavigate } from "react-router-dom";

function getChoiceImageURL(choice) {
  if (!choice) {
    return null; // or return a default image URL if you prefer
  }

  return `../images/${choice.toLowerCase()}.png`;
}

function Game() {
  const location = useLocation();
  const [userChoice, setUserChoice] = useState(null)
  const [user2Choice, setUser2Choice] = useState(null)
  const [userPoints, setUserPoints] = useState(0)
  const [user2Points, setUser2Points] = useState(0)
  const [turnResult, setTurnResult] = useState(null)
  const [result, setResult] = useState('Lets see who wins')
  const [gameOver, setGameOver] = useState(false)
  const gameInfo = location.state && location.state.data;
  const choices = ['ROCK', 'PAPER', 'SCISSORS']
  const [gameData, setGameData] = useState(null)
  const [user1Label, setUser1Label] = useState('')
  const [user2Label, setUser2Label] = useState('')
  const [userScore, setUserScore] =useState(0)
  const [user2Score, setUser2Score] =useState(0)
  const [result_p, setResult_p] =useState('')
  const [intervalId, setIntervalId] = useState(null);
  const [movesMade, setMovesMade] = useState(false);
  const [userMove, setUserMove] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Starta intervallet när komponenten monteras
    const id = setInterval(() => {
      fetchGameInfo()
    }, 1000); // Intervall i millisekunder, här satt till 1000 ms (1 sekund)

    // Spara intervallet i tillståndsvariabeln så att vi kan rensa det senare
    setIntervalId(id);

    // Rensa intervallet när komponenten avmonteras
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    console.log(gameInfo); // Här loggar vi gameInfo när komponenten renderas eller uppdateras.
  }, [gameInfo]);
  
  // const handleOnClick = (choice) => {
  //   setUserChoice(choice)
  //   // generateUser2Choice()
  // }


  // const generateComputerChoice = () => {
  //   const randomChoice = choices[Math.floor(Math.random() * choices.length)]
  //   setComputerChoice(randomChoice)
  // }

  const reset = () => {
    window.location.reload()
  }

  function fetchGameInfo() {
    
    if (!gameInfo) return; // Om ingen spelinfo, returnera
    fetch(`http://localhost:7979/api/games/${gameInfo?.gameId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerId: gameInfo?.playerOne?.playerId
      })
    })
    .then(response => response.json())
    .then(data => {

      setGameData(data); // Uppdatera speldata

      // Uppdatera etiketter för spelare
      if (gameInfo?.playerOne?.playerName == data?.playerOne) {
        setUser1Label(gameInfo?.playerOne?.playerName);
        setUser2Label(data?.playerTwo);
      } else {
        setUser1Label(data?.playerOne);
        setUser2Label(gameInfo?.playerOne?.playerName);
      }

      // Uppdatera spelarens poäng
      setUserScore(data?.playerOneWins);
      setUser2Score(data?.playerTwoWins);

     
      // If the game is over, announce the winner. Otherwise, display the moves.
    if (data?.status === 'PLAYER_ONE_IS_THE_WINNER' || data?.status === 'PLAYER_TWO_IS_THE_WINNER') {
      setGameOver(true);
      setResult_p(data?.status === 'PLAYER_ONE_IS_THE_WINNER' ? `${data?.playerOne.toUpperCase()} ÄR VINNAREN!!!` : `${data?.playerTwo.toUpperCase()} ÄR VINNAREN!!!`);
    } else {
      if (gameInfo?.playerOne?.playerName == data?.playerOne) {
        setResult_p(data?.playerTwoMove ? `Du ${data?.playerOneMove}, ${data?.playerTwo} ${data?.playerTwoMove}` : 'Väntar på drag...');
      } else {
        setResult_p(data?.playerOneMove ? `Du ${data?.playerTwoMove}, ${data?.playerOne} ${data?.playerOneMove}` : 'Väntar på drag...');
      }
    
      }

      // Om båda spelarna har gjort sina drag
      if (data?.playerOneMove && data?.playerTwoMove) {
        setUserChoice(gameInfo?.playerOne?.playerName == data?.playerOne ? data?.playerOneMove.toLowerCase() : data?.playerTwoMove.toLowerCase());
        setUser2Choice(gameInfo?.playerOne?.playerName == data?.playerOne ? data?.playerTwoMove.toLowerCase() : data?.playerOneMove.toLowerCase());
        
        setMovesMade(true); // Om båda spelarna har gjort sina drag, sätt movesMade till true
        setUserMove(null); // Återställ userMove efter att båda spelarna har gjort sina drag

        // Visa rätt resultatmeddelande
        if (gameInfo?.playerOne?.playerName == data?.playerOne) {
          setResult_p(`Du ${data?.playerOneMove}, ${data?.playerTwo} ${data?.playerTwoMove}`);
        } else {
          setResult_p(`Du ${data?.playerTwoMove}, ${data?.playerOne} ${data?.playerOneMove}`);
        }
      } else {
        setMovesMade(false); // Om någon spelare inte har gjort ett drag ännu, sätt movesMade till false
      }

      // Om spelet är över
      if (data?.status === 'PLAYER_ONE_IS_THE_WINNER' || data?.status === 'PLAYER_TWO_IS_THE_WINNER') {
        setGameOver(true);
        setResult_p(data?.status === 'PLAYER_ONE_WIN' ? `${data?.playerOne} is the winner!!!` : `${data?.playerTwo} is the winner!!!`);
      }

    })
    .catch(error => {
      console.log(error, "createGame"); // Visa felmeddelande vid fel
    });
}


function makeMove(move) {
  console.log('User made move:', move);

  setGameOver(false);

  //setUserChoice(move); //user's choice state variable
  setMovesMade(false); //We set movesMade state variable to false here
  if (!gameInfo) return
  fetch(`http://localhost:7979/api/games/move`,{
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // playerId: token
      playerId: gameInfo?.playerOne?.playerId,
      gameId: gameInfo?.gameId,
      playerMove: move

      
    })
  })
  .then(response => response.json())
  .then(data => {
    setGameData(data)
    console.log(gameInfo, 'Moved')
    setUserMove(move); // Set the user move after making the move
  


  })
  .catch(error => {
    console.log(error, "createGame");
   

  });

}

// function convertToWord(letter) {
//   if (letter === 'r') return 'ROCK';
//   if (letter === 'p') return 'PAPER';
//   return 'SCISSORS'
// }

  // useEffect(() => {
  //   const comboMoves = userChoice + user2Choice
  //   if(userPoints <=4 && user2Points <=4) {
  //     if(comboMoves === 'rockscissors' || comboMoves === 'paperrock' || comboMoves === 'scissorspaper') {
  //       const updatedUserPoints = userPoints + 1
  //       setUserPoints(updatedUserPoints)
  //       setTurnResult('User got the point')
  //       if(updatedUserPoints === 5) {
  //         setGameOver(true)
  //         setResult('User wins!!!')
  //       }
  //     }

  //     if (comboMoves === 'paperscissors' || comboMoves === 'scissorsrock' || comboMoves === 'rockpaper'){
  //       const updatedUser2Points = user2Points + 1
  //       setUser2Points(updatedUser2Points)
  //       setResult('Computer got the point')
  //       if(updatedUser2Points === 5){
  //         setGameOver(true)
  //         setResult('Computer wins')
  //       }
  //       }
  //   }


  //   if(comboMoves === 'rockrock' || comboMoves === 'paperpaper' || comboMoves === 'scissorsscissors'){
  //     setTurnResult('No one got the point')
  //   }

  // }, [userChoice, user2Choice])

  return (
    <div className="App">
      <h1 className='heading'>Rock Paper Scissors</h1>
      <div className='score'>
        <h1 className='score-user1'>{user1Label} : {userScore}</h1>
        <h1 className='score-user2'>{user2Label}: {user2Score}</h1>
      </div>
    

{/*Har satt ikonens state variabeln default värde till null och nedan sett till att det inte crashar om det returneras null istället för ikonvärdet*/}

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


      {/* <div className='play-online-btn'>
        <button>
          <Link to="/game">Create Game</Link>

        </button>

      </div> */}
    </div>
  );
}

export default Game