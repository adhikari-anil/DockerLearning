const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  path: process.env.SOCKET_PATH,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const port = process.env.PORT;

// Socket block
io.on("connection", (socket) => {
  //console.log("A user connected", socket.id);

  socket.on("joinAsSender", (room) => {
    // Sender joins the room
    socket.join(room);
    console.log("Sender joined room:", room);
    socket.room = room; // Store the room in the socket object
    socket.role = "sender"; // Store the role of the socket

    // Receiver Frontend ma aaunu parcha
    socket.to(room).emit("sender-joined", {
      message: "A sender has joined the room.",
      socketId: socket.id,
    });
  });

  socket.on("joinAsReceiver", (roomData) => {
    console.log("Receiver joining room:", roomData);
    const room = roomData.room;

    // 🔍 Check if a sender is already in the room
    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    if (clientsInRoom) {
      socket.join(room);
      console.log("Receiver joined room:", room);

      socket.room = room;
      socket.role = "receiver";
      socket.username = roomData.username;

      // Notify others in the room (e.g., the sender)
      socket.to(room).emit("receiver-joined", {
        message: "A receiver has joined the room.",
        socketId: socket.id,
        username: socket.username,
      });
      for (const clientId of clientsInRoom) {
        const clientSocket = io.sockets.sockets.get(clientId);
        if (clientSocket?.role === "sender") {
          // 🔔 Notify the receiver that sender is already in room
          socket.emit("sender-joined", {
            message: "A sender is already present in the room.",
            socketId: clientSocket.id,
          });
          break;
        }
      }
    } else {
      socket.emit("invalid-room", { message: "Invalid Room Code" });
    }
  });

  socket.on("offer", (data) => {
    console.log("offer data: ", data);
    io.to(data.to).emit("incomming-offer", {
      from: socket.id,
      offer: data.offer,
    });
  });

  socket.on("answer", (data) => {
    console.log("answer data: ", data);
    io.to(data.to).emit("incomming-answer", {
      from: socket.id,
      answer: data.answer,
    });
  });

  socket.on("ice-candidate", (data) => {
    console.log(`Replaying ICE candidate from ${socket.id} to ${data.to}`);
    io.to(data.to).emit("ice-candidate", {
      from: socket.id,
      candidate: data.candidate,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    const room = socket.room;
    const role = socket.role;

    if (room && role === "receiver") {
      // Notify the sender that the receiver has disconnected
      socket.to(room).emit("receiver-disconnected", {
        message: "A receiver has disconnected from the room.",
        socketId: socket.id,
      });
    }
    if (room && role === "sender") {
      // Notify the receiver that the sender has disconnected
      socket.to(room).emit("sender-disconnected", {
        message: "A sender has disconnected from the room.",
        socketId: socket.id,
      });
    }
  });
});

http.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
