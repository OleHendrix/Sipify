import React from 'react';
import logo from "../assets/Sipify.png";

function LogoHomeScreen()
{
  return (
    <img src={logo} className="absolute top-40 left-1/2 transform -translate-x-1/2 w-[200px] h-auto"/>
  );
}

export default LogoHomeScreen;