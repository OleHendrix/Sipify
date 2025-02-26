import React from 'react';
import logo from "../assets/Logo.png";

function LogoHomeScreen()
{
  return (
    <img src={logo} className="absolute top-40 left-1/2 transform -translate-x-1/2 w-[275px] h-auto"/>
  );
}

export default LogoHomeScreen;