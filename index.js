require("dotenv").config();
const http = require("http");
const moment = require("moment");
const express = require("express");
const { Server } = require("socket.io");
const { connectionMiddleware } = require("./src/middleware/socket");
const { WELCOME_MESSAGES } = require("./src/data/message");
const { logInfo } = require("./src/helpers/logger");

const app = express();
app.use(express.static(__dirname + "/chat/public"));
app.use(express.static(__dirname + "/slack/public"));
app.use(express.static(__dirname + "/chat_rieng/public"));

const server = http.createServer(app);
server.listen(process.env.APP_PORT, () =>
  console.log(`Socket is listening on port ${process.env.APP_PORT}!`)
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.emit("welcome", "Welcome to the WS server");
});

io.of("/chat").use(connectionMiddleware).on("connection", (socket) => {
  const random = Math.floor(Math.random() * WELCOME_MESSAGES.length);
  io.of("/chat").emit("server:notice", { message: WELCOME_MESSAGES[random]});
  socket.on("client:send", (data) => {
    logInfo(JSON.stringify({ route: '/chat', ...data }))
    io.of("/chat").emit("server:send", { ...data, socket_id: socket.id, time: moment().format("DD-MM HH:mm") });
  });
});

io.of("/chat_rieng").use(connectionMiddleware).on("connection", (socket) => {
  const random = Math.floor(Math.random() * WELCOME_MESSAGES.length);
  io.of("/chat_rieng").emit("server:notice", { message: WELCOME_MESSAGES[random]});
  socket.on("client:send", (data) => {
    logInfo(JSON.stringify({ route: '/chat_rieng', ...data }))
    io.of("/chat_rieng").emit("server:send", { ...data, socket_id: socket.id, time: moment().format("DD-MM HH:mm") });
  });
});