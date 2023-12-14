const UserModel = require("../model/useModel");
const brcypt = require("bcrypt");
const jwt = require('jsonwebtoken')
require("dotenv").config(); //读取配置文件
module.exports.register = async (req, res, next) => {
    try {
        const {username, password, email} = req.body;
        const usernameCheck = await UserModel.findOne({username});
        if (usernameCheck) {
            return res.json({
                msg: "Username already used",
                status: false,
            });
        }
        const emailCheck = await UserModel.findOne({email});
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
        const {username, password} = req.body;
        const usernameCheck = await UserModel.findOne({username});
        if (usernameCheck) {
            //brcypt比较一定要没有加密的在前
            const isPassword = await brcypt.compare(password, usernameCheck.password);
            if (isPassword) {
                const token = jwt.sign({username}, process.env.JWT_SECRET);
                return res.json({
                    status: true,
                    user: usernameCheck,
                    token: token
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
        const {image} = req.body;
        const userId = req.params.id;
        await UserModel.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage: image,
        }).then(data => {
            // console.log(data)
            res.json({
                isSet: data.isAvatarImageSet,
                image: data.avatarImage
            });
        }).catch(err => console.log(err.message))

    } catch (error) {
        next(error);
    }
};
module.exports.getAllUsers = async (req, res, next) => {
    try {
        console.log('getAllUsers')
        const users = await UserModel.find({_id: {$ne: req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ]).then((data, err) => {
            if (err) {
                console.log(err.message);
            } else {
                res.json(data)
            }
        })

    } catch (error) {
        next(error)
    }
}
module.exports.getUserDetail = async (req, res, next) => {
    try {
        const {user} = req.body
        const users = await UserModel.findOne({username: user}).then((data, err) => {
            if (err) {
                console.log(err.message);
            } else {
                res.json(data)
            }
        })

    } catch (error) {
        next(error)
    }
}
module.exports.searchUser = async (req, res, next) => {
    try {
        const user = await UserModel.find({
            username: {
                $regex: `.*${req.params.username}.*`,
                $options: 'i'
            }
        }).select(["username", "email", "avatarImage"]).then((data, err) => {
            if (err) {
                console.log(err.message)
            } else {
                res.json({
                    userDetail: data
                })
            }
        })

    } catch (e) {
        next(e)
    }
}
module.exports.requestFriend = async (req, res, next) => {
    try {
        const {to, requestMessage} = req.body
        const result = await UserModel.updateOne({username: to}, {$pull: {friendsRequest: requestMessage}}).then(async (data, err) => {
            if (err) {
                console.log(err)
            }

            await UserModel.updateOne({username: to}, {$push: {friendsRequest: requestMessage}}).then((data, err) => {
                if (err) {
                    console.log(err)
                }
                res.json({
                    state: "好友申请发送成功"
                })
            })

        })
    } catch (e) {
        next(e)
    }
}
module.exports.handleFriendsRequest = async (req, res, next) => {
    try {
        const {type, currentUsername, requestId, requestUsername} = req.body
        console.log(type, currentUsername, requestId, requestUsername)
        const result = await UserModel.updateOne(
            {
                username: currentUsername,
                friendsRequest: {
                    $elemMatch: {_id: requestId}
                }
            },
            {$set: {"friendsRequest.$.state": type}}
        ).then(async (data, err) => {
            if (err) {
                console.log(err)
            }
            if (type === 1) {
                const user1 = await UserModel.findOne({username: currentUsername})
                const user2 = await UserModel.findOne({username: requestUsername})
                console.log(user1, user2)
                await UserModel.updateOne({username: currentUsername}, {$push: {linkList: user2}}).then((data, err) => {
                    if (err) {
                        console.log(err)
                    }

                })
                await UserModel.updateOne({username: requestUsername}, {$push: {linkList: user1}}).then((data, err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }
            // 此处需要转发告诉在线的用户 假如他在线 更新他的好友列表
            const userDetail = await UserModel.findOne({username: currentUsername})
            res.json({
                userDetail
            })

        })
    } catch (e) {
        next(e)
    }
}
module.exports.deleteUser = async (req, res, next) => {
    try {
        const {currentUser, currentChat} = req.body
        console.log(currentUser, currentChat)
        await UserModel.updateOne({username: currentUser},{$pull: {linkList: {username: currentChat}}}).then(async (data,err) => {
            if (err) {
                console.log(err)
            }
            await UserModel.updateOne({username: currentChat},{$pull:{linkList: {username:currentUser}}}).then((data,err) => {
                if (err) {
                    console.log(err)
                }
            })
            await UserModel.findOne({username: currentUser}).then((data,err) => {
                if (err) {
                    console.log(err)
                }
                res.json({
                    userDetail: data
                })
            })
        })
    } catch (e) {
        next(e)
    }
}