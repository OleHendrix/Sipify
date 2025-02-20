import { io } from "socket.io-client";

// 🔹 Verbind met de backend WebSocket-server
const socket = io("http://localhost:5001", 
{
  transports: ["websocket"], // Zorgt voor stabiele connectie
  autoConnect: false, // Verbind niet direct
});

export default socket;