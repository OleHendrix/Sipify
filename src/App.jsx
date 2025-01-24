import {useState} from 'react'
import './index.css'
import Home from './screens/Home'
import StartScreen from './screens/StartScreen'
import LoginScreen from './screens/LoginScreen'
import CreateGame from './screens/CreateGame'
import JoinGame from './screens/JoinGame'
import GameLobby from './screens/GameLobby'

function App()
{
  const [currentScreen, setCurrentScreen] = useState('home');
  const [username, setUserName] = useState('');
  const [rounds, setRounds] = useState(0);

  return (
    <div>
      {currentScreen === 'home' && (<Home onNavigate={setCurrentScreen}/>)}
      {currentScreen === 'how-it-works' && (<StartScreen onNavigate={setCurrentScreen}/>)}
      {currentScreen === 'login' && (<LoginScreen onNavigate={setCurrentScreen} setUserName={setUserName} username={username}/>)}
      {currentScreen === 'create-game' && (<CreateGame onNavigate={setCurrentScreen} username={username} rounds={rounds} setRounds={setRounds}/>)}
      {currentScreen === 'join-game' && (<JoinGame onNavigate={setCurrentScreen}/>)}
      {currentScreen === 'game-lobby' && (<GameLobby onNavigate={setCurrentScreen} username={username} rounds={rounds}/>)}
    </div>
  );
}

export default App