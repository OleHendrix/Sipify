import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {useState, useEffect} from 'react'
import './index.css'
import Home from './screens/Home'
import StartScreen from './screens/StartScreen'
import LoginScreen from './screens/LoginScreen'
import CreateGame from './screens/CreateGame'
import JoinGame from './screens/JoinGame'
import GameLobby from './screens/GameLobby'
import Play from './screens/Play'

function App()
{
  // localStorage.clear();
  const [username, setUserName] = useState(() => {return localStorage.getItem('username') || '' });
  const [gamePin, setGamePin] = useState(() => {return Number(localStorage.getItem('gamepin')) || 0 });
  const [rounds, setRounds] = useState(0);

  useEffect(() => {localStorage.setItem('username', username);}, [username]);
  useEffect(() => {localStorage.setItem('gamepin', gamePin);}, [gamePin]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/how-it-works" element={<StartScreen/>}/>
        <Route path="/login" element={<LoginScreen setUserName={setUserName} username={username}/>}/>
        <Route path="/create-game" element={<CreateGame username={username} rounds={rounds} setRounds={setRounds} setGamePin={setGamePin}/>}/>
        <Route path="/join-game" element={<JoinGame username={username} gamePin={gamePin} setGamePin={setGamePin}/>}/>
        <Route path="/game-lobby/:gamePin" element={<GameLobby/>}/>
        <Route path="/play/:gamePin" element={<Play/>}/>
      </Routes>
    </Router>
  );
}

export default App