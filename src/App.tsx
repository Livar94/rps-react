// import GameRobot from './components/GameRobot.jsx'
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Online from './components/Online.jsx';
// import Game from './components/Game.jsx';

// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<GameRobot />} />
//         <Route path="/online" element={<Online />} />
//         <Route path='/game' element={< Game/>} />
//       </Routes>
//     </BrowserRouter>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import GameRobot from './components/GameRobot';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Online from './components/Online';
import Game from './components/Game';

function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameRobot />} />
          <Route path="/online" element={<Online />} />
          <Route path='/game' element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
