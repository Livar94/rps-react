import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/StylesOnline.css';

interface Game {
  gameId: string;
}

function Online(): JSX.Element {
  const navigate = useNavigate();
  const [token, setToken] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [games, setGames] = useState<Game[]>([]);

  function renderGameNumber(index: number): string {
    return `Game ${index + 1}`;
  }

  useEffect(() => {
    fetchGames();
  }, []);

  function getToken(func: (p1: string, token: string) => void, p1: string) {
    fetch('http://localhost:8080/api/user/auth/token', {
      method: 'post',
    })
      .then((response) => response.json())
      .then((data: string) => {
        console.log(data, 'token');
        setToken(data);
        func(p1, data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function postName(name: string, token: string) {
    console.log(token, name, 'nameToken');
    fetch('http://localhost:8080/api/user/name', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Token: token,
      },
      body: JSON.stringify({
        name,
      }),
    })
      .then((response) => response)
      .then((data) => {
        console.log(data, 'response');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function createGame() {
    fetch('http://localhost:8080/api/games/game', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate('/game', {
          state: {
            data,
          },
        });
      })
      .catch((error) => {
        console.log(error, 'createGame');
      });
  }

  function fetchGames() {
    fetch('http://localhost:8080/api/games/games', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data: Game[]) => {
        console.log(data, 'games');
        setGames(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function joinGame(gameId: string) {
    console.log(gameId, token, 'getting game and player id');
    fetch(`http://localhost:8080/api/games/join`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        gameId,
      },
      body: JSON.stringify({
        playerId: token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, 'joined game');
        navigate('/game', {
          state: {
            data: {
              gameId,
              playerOne: { playerId: token, playerName: name },
            },
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className='container'>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const target = e.target as HTMLFormElement
            const inputElement = target[0] as HTMLInputElement;  
            setName(inputElement.value);  
            if (!token) getToken(postName, inputElement.value);
          }}
          className='write-name'
        >
          <input
            type='text'
            name='userName'
            minLength={3}
            maxLength={20}
            required
            autoComplete='off'
            placeholder='Write name'
          />
          <button className='generate-token' type='submit'>
            Write Name
          </button>
        </form>
        {token ? (
          <div className='user-options'>
            <button className='create-game' onClick={createGame}>
              Create Game
            </button>

            <ul className='open-games'>
              <span>All open games:</span>
              {games.map((game, index) => (
                <li key={game?.gameId}>
                  <button
                    className='join-game-btn'
                    onClick={() => joinGame(game?.gameId)}
                  >
                    {renderGameNumber(index)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default Online;
