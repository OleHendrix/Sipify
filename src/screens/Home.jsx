import React from 'react';
import logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";

function Home() 
{   
  const navigate = useNavigate();
  return (     
    <div className="h-[812px] flex justify-center items-center" onClick={() => navigate('/how-it-works')} >       
      <div className="flex flex-col items-center mb-[60px]">
        <img src={logo} className='w-[350px] h-auto'/>       
        {/* <p className='font-thin text-white text-center text-[18px] m-0 max-w-[280px]'>How well do you know your own music taste?</p> */}
      </div>
    </div>   
  );
}

export default Home;