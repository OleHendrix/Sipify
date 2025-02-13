import React from 'react';
import LogoHomeScreen from '../components/LogoHomeScreen';
import Button from '../components/Button'; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

async function postNewGame(username, rounds, setGamePin, navigate)
{
  try
  {
    const response = await axios.post('http://localhost:5001/api/create-game', {username: username, rounds: rounds,});
    setGamePin(response.data.gamePin);
    navigate(`/game-lobby/${response.data.gamePin}`);
  }
  catch (error)
  {
    console.error("Error creating game:", error);
  }
}

function CreateGame({username, setRounds, setGamePin})
{
  const navigate = useNavigate();

  return (
    <div>
      <LogoHomeScreen/>
      <div className='font-bold w-[375px] h-[812px] flex justify-center items-center flex-col gap-3'>
        <Button className={'shadow-2xl'} text="2 rounds" onClick={() => {setRounds(2); postNewGame(username, 2, setGamePin, navigate);}}/>
        <Button className={'shadow-2xl'} text="5 rounds" onClick={() => {setRounds(5); postNewGame(username, 5, setGamePin, navigate);}}/>
        <Button className={'shadow-2xl'} text="10 rounds" onClick={() => {setRounds(10); postNewGame(username, 10, setGamePin, navigate);}}/>
        <Button className={'shadow-2xl'} text="20 rounds" onClick={() => {setRounds(20); postNewGame(username, 20, setGamePin, navigate);}}/>
      </div>
    </div>
  );
}

export default CreateGame;