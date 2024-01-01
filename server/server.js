const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");

// routes
const lobbyRoutes = require("./routes/lobbyRoutes");
const boardRoutes = require("./routes/boardRoutes");

// cors
const cors = require("cors");

// models
const Board = require("./models/boardModel");
const Lobby = require("./models/lobbyModel");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/lobby", lobbyRoutes);
app.use("/api/board", boardRoutes);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("-------------------------------------".yellow.bold);
  console.log("New client connected");

  let lobbyId = "";

  socket.on("join_lobby", (data) => {
    console.log("-------------------------------------".yellow.bold);
    console.log("Join lobby");
    console.log(data);
    if (data) {
      lobbyId = data;
    }

    const room = io.sockets.adapter.rooms.get(lobbyId);
    const num_clients = room ? room.size : 0;

    if (num_clients < 2) {
      socket.join(lobbyId);
      socket.emit("joined_lobby");
    } else {
      socket.emit("lobby_full");
    }
  });

  socket.on("create_lobby", (data) => {
    console.log("-------------------------------------".yellow.bold);
    console.log("Create lobby");
    console.log(data);
    lobbyId = data._id;
    socket.join(lobbyId);

    socket.emit("created_lobby", data);
  });

  socket.on("move", async (data) => {
    console.log("-------------------------------------".yellow.bold);
    console.log("Move");
    console.log(data);
    if (data.lobbyId) {
      lobbyId = data.lobbyId;
    }

    io.to(lobbyId).emit("moved", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Handle disconnection logic here
  });
});
