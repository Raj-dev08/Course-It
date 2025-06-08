import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from 'compression';

import path from "path";

import { connectDB } from "./lib/db.js";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";

import authRoutes from "./routes/auth.route.js";
import courseRoutes from "./routes/course.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import groupChatRoutes from "./routes/groupchat.route.js";
import quizRoutes from "./routes/quiz.route.js";
import videoRoutes from "./routes/video.route.js";

import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(compression({
  filter: (req, res) => {
    const contentType = res.getHeader('Content-Type') || '';
    return /json|text|javascript|css|html/.test(contentType);
  }
}));


app.use(arcjetMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/groupchat", groupChatRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/video", videoRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});