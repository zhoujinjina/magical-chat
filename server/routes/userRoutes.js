const { register, login,setAvatar, getAllUsers, searchUser} = require('../controllers/userController')

const router=require('express').Router()

router.post('/register',register)

router.post('/login',login)

router.post('/setAvatar/:id',setAvatar)

router.get('/allusers/:id',getAllUsers)
router.get('/searchUser/:username',searchUser)

module.exports=router