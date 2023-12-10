const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:8
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:50,
    },
    //是否上传了头像
    isAvatarImageSet:{
        type:Boolean,
        default:false
    },
    //头像的路径
    avatarImage:{
        type:String,
        default:''
    },
    //好友请求
    friendsRequest: {
        type: [
            {
                username:{
                    type: String,
                    required: true
                },
                message:{
                    type: String,
                    required: true
                },
                state:{
                    type: Number,
                    // 0 待处理 1 同意 2 拒绝
                    required: true
                },
                avatarImage:{
                    type:String,
                    default:''
                },
                email:{
                    type:String,
                    required:true
                }

            }
        ],
        default: []
    },
    // 好友列表
    linkList: {
       type: [
           {
               id:{
                   type:mongoose.Schema.Types.ObjectId,
                   required: true
               },
               username: {
                   type: String,
                   required: true
               },
               avatarImage:{
                   type:String,
                   default:''
               }
           }
       ]
    }
})
 
const UserModel=mongoose.model('user',userSchema)

 module.exports=UserModel