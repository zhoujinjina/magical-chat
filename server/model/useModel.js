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
    }
})
 
const UserModel=mongoose.model('user',userSchema)

 module.exports=UserModel