const { register, login,setAvatar, getAllUsers, searchUser,requestFriend,handleFriendsRequest} = require('../controllers/userController')

const router=require('express').Router()

router.post('/register',register)

router.post('/login',login)

router.post('/setAvatar/:id',setAvatar)

router.get('/allusers/:id',getAllUsers)
router.get('/searchUser/:username',searchUser)
router.post('/requestFriend',requestFriend)
router.post('/handleFriendsRequest',handleFriendsRequest)

module.exports=router