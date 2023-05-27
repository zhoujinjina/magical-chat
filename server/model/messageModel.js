const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      text: {
        type: String,
        required: true,
      },
      users: Array,
      sender: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
      }
    },
  },
  {
    timestamps: true,
  }
);
const messageModel = mongoose.model("Messages", messageSchema);

module.exports= messageModel
