const connectionMiddleware = (socket, next) => {
  socket.on("error", (err) => console.log(err.message));
  socket.on("disconnect", (reason) => console.log(reason));
  socket.on("client:notice", (data) => console.log(data));
  next();
};

module.exports = {
  connectionMiddleware,
};
