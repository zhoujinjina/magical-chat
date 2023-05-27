const messageModel = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    await messageModel
      .create({
        message: {
          text: message,
          users: [from, to],
          sender: from,
        },
      })
      .then((data, err) => {
        if (err) {
          res.json({
            status: true,
            msg: "message add success",
          });
        } else {
          res.json({
            status: false,
            msg: "message add failure",
          });
        }
      });
  } catch (error) {
    next(error);
  }
};
module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    await messageModel
      .find({
       "message.users":{
        $all:[from,to]
       }
      }).sort({updateAt:1})
      .then((data, error) => {
        if (error) {
          console.log(error);
          res.json({
            msg: "get messages error",
            status: false,
          });
        } else {
            const projectMessages=data.map(msg=>{
                return {
                    fromSelf:msg.message.sender.toString()===from,
                    message:msg.message.text
                }
            })
          res.json({
            msg: "get messages success",
            status: true,
            data: projectMessages,
          });
        }
      });
  } catch (error) {
    next(error);
  }
};
