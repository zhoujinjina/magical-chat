const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messagesRoute");
const app = express();
require("dotenv").config(); //读取配置文件
app.use(cors()); //处理跨域请求
app.use(express.json()); //自动解析请求体中的 JSON数据，并将其转换为 JavaScript 对象,保存在 req.body 属性
app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoutes);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connction started on ");
  })
  .catch((err) => console.log(err.message));

const server = app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    Credential: true,
  },
});

global.onlineUsers = new Map();
//每个客户端都会触发 connection 事件并创建一个新的 socket 对象，
// 因此在处理事件时需要注意区分不同的客户端
// 使用了 socket.id 来标识不同的客户端，以便服务器可以正确地处理每个客户端的请求。

// 假如有客户端连接到了 然后可以监听adduser事件，等待自己的客户端发送，然后存到global对象中，
// 然后假如自己的客户端发送了信息，服务端监听到，然后看看是发给谁的，然后再看看他在不在线，在线就发给他
// 假如要实现群聊，那么这个接收方就是很多人，那么就要给群里的人都发送，群里人接收到，
// 然后更新聊天记录(但是要判断是不是来自chat群聊中的一个)
io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  });
});
