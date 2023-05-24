const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes= require("./routes/userRoutes");
const app = express();
require("dotenv").config(); //读取配置文件
app.use(cors()); //处理跨域请求
app.use(express.json()); //自动解析请求体中的 SON数据，并将其转换为 JavaScript 对象,保存在 req.body 属性
app.use('/api/auth',userRoutes)
app.get("/", (req, res) => [res.end("hello")]);
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
