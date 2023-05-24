const UserModel = require("../model/useModel");
const brcypt = require("bcrypt");
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
    const hashedPassword = await brcypt.hash(password, 10);
    UserModel.create({
      username,
      email,
      password: hashedPassword,
    }).then(user => {
      return res.json({
        status: true,
        user:user,
      });
    })
    
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
      const isPassword = await brcypt.compare(password,usernameCheck.password);
      if (isPassword) {
        console.log("jinlaile")
        return res.json({
          status: true,
          user:usernameCheck,
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
