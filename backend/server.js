import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import gameRoutes from "./game.js";

const app = express();

const corsOptions = {origin: "*"};
app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {console.log("⚡ Client connected:", socket.id);});
  
export { io };

app.use("/api/games", gameRoutes);

server.listen(5001);