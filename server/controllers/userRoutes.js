const UserModel = require("../model/useModel");
const brcypt = require("bcrypt");
const jwt = require('jsonwebtoken')
require("dotenv").config(); //读取配置文件
module.exports.register = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const usernameCheck = await UserModel.findOne({ username });
    if (usernameCheck) {
      return res.json({
        msg: "Username already used",
        status: false,
      });
    }
    const emailCheck = await UserModel.findOne({ email });
    if (emailCheck) {
      return res.json({
        msg: "Email already used",
        status: false,
      });
    }
    const hashedPassword = await brcypt.hash(password, 10);//加密
    UserModel.create({
      username,
      email,
      password: hashedPassword,
    }).then((user) => {
      return res.json({
        status: true,
        user: user,
      });
    });
  } catch (error) {
    next(error);
  }
};
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const usernameCheck = await UserModel.findOne({ username });
    if (usernameCheck) {
      //brcypt比较一定要没有加密的在前
      const isPassword = await brcypt.compare(password, usernameCheck.password);
      if (isPassword) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET);
        return res.json({
          status: true,
          user: usernameCheck,
          token:token
        });
      }
    } else {
      return res.json({
        msg: "username or password error",
        status: false,
      });
    }
  } catch (error) {
    next(error);
  }
};
module.exports.setAvatar = async (req, res, next) => {
  try {
    const { image } = req.body;
    const userId = req.params.id;
   await UserModel.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage: image,
    }).then(data => {
      console.log(data)
        res.json({
          isSet:data.isAvatarImageSet,
          image:data.avatarImage
        });
    }).catch(err=>console.log(err.message))
    
  } catch (error) {
    next(error);
  }
};
module.exports.getAllUsers=async(req,res,next)=>{
  try {
    console.log('getAllUsers')
    const users=await UserModel.find({_id:{$ne:req.params.id}}).select([
      "email",
      "username",
      "avatarImage",
      "_id"
    ]).then((data,err)=>{
        if(err){
          console.log(err.message);
        }else{
          res.json(data)
        }
    })

  } catch (error) {
    next(error)
  }
}