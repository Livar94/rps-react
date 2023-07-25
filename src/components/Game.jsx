import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';


function Game() {
  const location = useLocation();
  const [userChoice, setUserChoice] = useState('rock')
  const [user2Choice, setUser2Choice] = useState('rock')
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
    if (!gameInfo) return
    fetch(`http://localhost:8080/api/games/${gameInfo?.gameId}`,{
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // playerId: token
        playerId: gameInfo?.playerOne?.playerId
        
      })
    })
    .then(response => response.json())
    .then(data => {
      // console.log(gameInfo);
      console.log(data, "gameData")
        // gameData = data
      // update game score:
      setGameData(data)
      if (gameInfo?.playerOne?.playerName == data?.playerOne) {
    //         user1Label.innerText = gameInfo.playerOne.playerName
    //         user2Label.innerText = gameData.playerTwo
    setUser1Label(gameInfo?.playerOne?.playerName)
    setUser2Label(data?.playerTwo)

          } else {
    //         user1Label.innerText = gameData.playerOne
    //         user2Label.innerText = gameInfo.playerOne.playerName
    setUser1Label(data?.playerOne)
    setUser2Label(gameInfo?.playerOne?.playerName)
    }
    setUserScore(data?.playerOneWins)
    setUser2Score(data?.playerTwoWins)

            if (gameInfo?.playerOne?.playerName == data?.playerOne) {
              // result_p.innerText = gameData.playerOneMove
              // result_p.innerText = `You ${gameData.playerOneMove}, ${gameData.playerTwo} ${gameData.playerTwoMove}`
              setResult_p(`You ${data?.playerOneMove}, ${data?.playerTwo} ${data?.playerTwoMove}`)

            } else {
              // result_p.innerText = gameData.playerTwoMove
              // result_p.innerText = `You ${gameData.playerTwoMove}, ${gameData.playerOne} ${gameData.playerOneMove}`
              setResult_p(`You ${data?.playerTwoMove}, ${data?.playerOne} ${data?.playerOneMove}`)
            };
    })
    .catch(error => {
      console.log(error, "createGame");
    });
}
// setInterval(fetchGameInfo, 1000);

function makeMove(move) {
  if (!gameInfo) return
  fetch(`http://localhost:8080/api/games/move`,{
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
        <h1>{user1Label} : {userScore}</h1>
        <h1>{user2Label}: {user2Score}</h1>
      </div>
      {/* <div className='choice'>
        <div className='choice-user'>
          <img className='user-hand' src={`../images/${gameData?.playerOneMove}.png`} alt="" />
        </div>
        <div className='choice-computer'>
          <img className='computer-hand' src={`../images/${gameData?.playerTwoMove}.png`} alt="" />
        </div>
      </div> */}
      <div children='button-div'>
        {choices.map((choice, index) =>
          <button className='button' key={choice} onClick={() => {
            makeMove(choice)
          }}>
            {choice}
          </button>
        
        )}

      </div>
      <div className='result'>
        {/* <h1>Turn Result: {turnResult}</h1>
        <h1>Final Result: {result}</h1> */}
        <h1>{result_p}</h1>

      </div>
      <div className='button-div'>
        {gameOver && 
          <button className='button' onClick={() => reset()}>Restart Game</button>
        }
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