import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//to get socket with user
const userSocketMap = {}; // object of userIds:socketId

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;


  io.emit("getOnlineUsers", Object.keys(userSocketMap));


  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User ${userId} joined group ${groupId}`);
  }); 

  socket.on("typing",({from,to})=>{
    // console.log("working")
    socket.to(to).emit("userTyping",{from})
  })

  socket.on("typingToUser",({from,to})=>{
    // console.log("working")
    const receiverSocketId = getReceiverSocketId(to);
    
    
    socket.to(receiverSocketId).emit("userTypingToUser",{from})
  })

  socket.on("stopTyping",({from,to})=>{
    // console.log("removing")
    socket.to(to).emit("userStoppedTyping",{from})
  })

  socket.on("stopTypingToUser",({to})=>{
    // console.log("removing")
    const receiverSocketId = getReceiverSocketId(to);
    socket.to(receiverSocketId).emit("userStoppedTypingToUser")
  })

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });


});

export { io, app, server };