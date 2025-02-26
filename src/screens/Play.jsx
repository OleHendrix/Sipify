import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import React from 'react';
import Button from '../components/Button';
import GameBackground from '../components/GameBackground';
import socket from "../client_socket";
import Lottie from "lottie-react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function Play()
{
    return (
    <div className='relative w-[375px] h-[812px] overflow-hidden z-[0]'>
        <GameBackground/>
    </div>
  )
}

export default Play;