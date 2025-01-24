import React from 'react';
import gameBackground from "../assets/gameBackground.svg";

function GameBackground()
{
  return (
    <img src={gameBackground} className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[350px] z-[-1] h-auto"/>
  );
}

export default GameBackground;