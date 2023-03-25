const socket = io("http://192.168.1.182:8080/chat_rieng");
socket.on("connect", () => {
  socket.emit("client:notice", { message: `OK! I'm connected to Chat`, socket_id: socket.id });
});
socket.on("disconnect", (reason) => console.log(reason));

socket.on("server:notice", (data) => {
  $("#messages").append(`<li class="notice-line"><span class="notice">${data.message}</span></li>`)
});
socket.on("server:send", (data) => {
  const value = data.socket_id === socket.id ? msgOwner(data) : msg(data);
  $("#messages").append(value);
  $("#messages").animate({ scrollTop: $('#messages').prop("scrollHeight")}, 200);
});

const msg = (data) => {
  return `<li class="message-line">
            <div class="message-box">${data.message}
              <p class="info">[Thím - ${data.username}] - ${data.time}</p>
            </div>
          </li>`;
}

const msgOwner = (data) => {
  return `<li class="message-line-owner">
            <div class="message-box owner">${data.message}
              <p class="info-owner">[Thím - ${data.username}] - ${data.time}</p>
            </div>
          </li>`;
}

$("#f-message").on("submit", (e) => {
  e.preventDefault();
  const message = $("#message").val();
  const username = $("#username").val();
  checkUsername();
  if(message === "" || username === "") return;
  socket.emit("client:send", { username: username.toUpperCase(), message });
  $("#messages").animate({ scrollTop: $('#messages').prop("scrollHeight")}, 200);
  $("#message").val("")
});

const checkUsername = () => {
  const username = $("#username").val();
  if (username === "") return alert("Nhập tên vô đi thím ơi!\nẨn danh không ai biết thím là ai đâu");
  if (username !== "") $("#username").prop("disabled", true)
}