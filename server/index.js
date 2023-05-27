const express = require("express");
const cors = require("cors");
const socket=require('socket.io')
const mongoose = require("mongoose");
const userRoutes= require("./routes/userRoutes");
const messagesRoutes= require("./routes/messagesRoute");  
const app = express();
require("dotenv").config(); //读取配置文件
app.use(cors()); //处理跨域请求
app.use(express.json()); //自动解析请求体中的 SON数据，并将其转换为 JavaScript 对象,保存在 req.body 属性
app.use('/api/auth',userRoutes)
app.use('/api/messages',messagesRoutes)
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
const io=socket(server,{
  cors:{
    origin:"http://127.0.0.1:3000",
    Credential:true
  }
})

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  });
})