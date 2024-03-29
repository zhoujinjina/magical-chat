import React, {useEffect, useState} from "react";
import Logo from "../assets/logo.svg";
import styled from "styled-components";
import {
    ArrowLeftOutlined,
    BellOutlined, CheckOutlined, CloseOutlined, EditOutlined, EllipsisOutlined, MessageOutlined,
    QqOutlined,
    SettingOutlined, TeamOutlined,
    UserAddOutlined,
    UserSwitchOutlined
} from "@ant-design/icons"
import {Avatar, Card, Input, message} from 'antd';
import {handleFriendsRequest, requestFriend, searchUser} from "../utils/ApIRouters";
import axios from "axios";
import Meta from "antd/es/card/Meta";
import {useNavigate} from "react-router-dom";

const {Search} = Input;
const Contacts = ({setIfNotice, ifNotice, contacts, currentUser, changeChat, setCurrentUser, socket}) => {
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [currentUsername, setCurrentUsername] = useState(undefined);
    const [currentAvatarImage, setCurrentAvatarImage] = useState('');
    const [open, setOpen] = useState(false)
    const [select, setSelect] = useState("")
    const [searchUsers, setSearchUsers] = useState(undefined)
    const navigate = useNavigate()
    useEffect(() => {
        if (currentUser) {
            setCurrentUsername(currentUser.username)
            setCurrentAvatarImage(currentUser.avatarImage)
        }
    }, [currentUser]);
    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index)
        changeChat(contact)
    }
    const handleOpen = (type) => {
        setOpen(true)
        switch (type) {
            case 0 :
                localStorage.clear()
                navigate('/login');
                break;
            case 1 :
                setSelect("addUser");
                break;
            case 2 :
                setSelect("message");
                break;
        }
    }
    const chat = (username) => {
        // 直接切换到聊天
        const user = contacts.find(item => item.username === username)
        const index = contacts.indexOf(user)
        changeCurrentChat(index, user)
        setOpen(false)
    }
    const onSearch = (value, _e, info) => {
        // 搜索用户
        // console.log(info?.source, value, _e);
        axios.get(`${searchUser}/${value}`).then(r => {
            const newData = r.data.userDetail.filter(item => item.username !== currentUsername)
            setSearchUsers(newData)
        }).catch(e => console.log(e))
    }
    const ifFriends = (user) => {
        // 判断是否是联系人
        const list = currentUser?.linkList.map(item => item.username)
        return list?.includes(user?.username)
    }
    const addFriends = (to, requestMessage) => {
        // console.log(to)
        // console.log(requestMessage)
        axios.post(requestFriend, {to, requestMessage}).then(r => {
            message.success("好友申请发送成功！")
            socket.current.emit("addFriends", {notice: to})
        }).catch(e => console.log(e))
    }
    const handleRequest = (type, currentUsername, requestId, requestUsername) => {
        // console.log(type,currentUsername,requestId,requestUsername)
        axios.post(handleFriendsRequest, {type, currentUsername, requestId, requestUsername}).then(r => {
            // console.log(r.data.userDetail)
            localStorage.setItem("chat-app-user", JSON.stringify(r.data.userDetail));
            setCurrentUser(r.data.userDetail)
            socket.current.emit("handleRequest", {notice: requestUsername})
        }).catch(e => console.log(e))
    }
    return (
        <>
            {contacts && currentUser && (
                <>
                    {
                        open ? <>
                            {
                                select === "addUser" && <OpenContainer>
                                    <div className="search">
                                        <div><ArrowLeftOutlined onClick={() => {
                                            setOpen(false)
                                            setSearchUsers(undefined)
                                        }}/></div>
                                        <Search
                                            placeholder="用户名"
                                            onSearch={onSearch}
                                            style={{
                                                width: "86%"
                                            }}
                                        />
                                    </div>
                                    <div className="userList">
                                        {
                                            searchUsers === undefined ? null : searchUsers.length === 0 ?
                                                <>
                                                    <div style={{fontSize: 50, color: "#00000052"}}><TeamOutlined/></div>
                                                    <div style={{color: "#2c2121cc"}}>未找到相关用户</div>
                                                </> : <>
                                                    {
                                                        searchUsers.map((user, index) => {
                                                            return <Card
                                                                key={index}
                                                                style={{
                                                                    width: "90%",
                                                                    // marginTop: 16,
                                                                    // height: 100
                                                                    // backgroundColor: "#9A9A9A",
                                                                    overflow: "hidden",
                                                                    minWidth: 0
                                                                }}
                                                                // extra = {<div>add</div>}
                                                                size="small"
                                                                hoverable={true}
                                                            >
                                                                <div style={{
                                                                    width: "94%",
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                }}>
                                                                    <Meta
                                                                        avatar={<Avatar
                                                                            src={`data:image/svg+xml;base64,${user.avatarImage}`}/>}
                                                                        title={user.username}
                                                                        description={<div style={{
                                                                            display: "flex",
                                                                            justifyContent: "flex-start",
                                                                            alignItems: "center",
                                                                        }}>
                                                                            <div>
                                                                                <svg t="1701935886274" className="icon"
                                                                                     viewBox="0 0 1024 600" version="1.1"
                                                                                     xmlns="http://www.w3.org/2000/svg"
                                                                                     p-id="6560" width="17" height="17">
                                                                                    <path
                                                                                        fill="rgb(0,0,0,0.5)"
                                                                                        d="M891.521 169.794H132.468c-36.144 0-49.696 9.041-49.696 49.696v528.625c0 40.657 13.558 49.696 49.696 49.696H887c36.144 0 49.696-9.04 49.696-49.696V219.49c4.518-40.657-9.04-49.696-45.187-49.696z m-67.77 49.704C710.8 323.417 539.101 499.625 521.033 513.177c-4.518 4.517-9.042 4.517-18.072 0-22.586-18.072-207.836-194.281-311.751-293.68h632.536zM132.48 748.126V237.578l271.087 257.531c27.108 27.109 45.187 40.657 58.732 54.218 18.071 9.041 31.63 13.557 49.696 13.557s31.63-4.517 49.696-13.557v-4.517c27.108-18.072 112.951-108.432 329.82-307.232v510.548H132.456z m0 0z"
                                                                                        p-id="6561"></path>
                                                                                </svg>
                                                                            </div>
                                                                            <div
                                                                                style={{overflow: "hidden",}}>{`:${user.email}`}</div>
                                                                        </div>}
                                                                        style={{width: "100%"}}
                                                                    />
                                                                    {
                                                                        !ifFriends(user) ? <div
                                                                                onClick={() => addFriends(user.username, {
                                                                                    username: currentUsername,
                                                                                    message: "我想添加你为好友~",
                                                                                    avatarImage: currentAvatarImage,
                                                                                    state: 0
                                                                                })}><UserAddOutlined/></div> :
                                                                            <div onClick={() => chat(user.username)}>
                                                                                <MessageOutlined/></div>
                                                                    }
                                                                </div>
                                                            </Card>
                                                        })
                                                    }
                                                </>
                                        }
                                    </div>
                                </OpenContainer>

                            }
                            {
                                select === "message" && <OpenContainer2>
                                    <div className="head"><ArrowLeftOutlined onClick={() => setOpen(false)}/>
                                    </div>
                                    <div className="requestList">
                                        {
                                            currentUser?.friendsRequest?.sort((a, b) => a.state - b.state).map((request, index) => {
                                                return <Card
                                                    key={index}
                                                    style={{
                                                        width: "90%",
                                                        // marginTop: 16,
                                                        // height: 100
                                                        // backgroundColor: "#9A9A9A",
                                                        overflow: "hidden",
                                                        minWidth: 0
                                                    }}
                                                    actions={request.state === 0 ? [
                                                        <div
                                                            onClick={() => handleRequest(1, currentUsername, request._id, request.username)}>同意</div>,
                                                        <div
                                                            onClick={() => handleRequest(2, currentUsername, request._id, request.username)}>拒绝</div>
                                                    ] : request.state === 1 ? [
                                                        <div>已同意</div>
                                                    ] : [
                                                        <div>已拒绝</div>
                                                    ]}
                                                    // extra = {<div>add</div>}
                                                    size="small"
                                                    hoverable={true}
                                                >
                                                    <div style={{
                                                        width: "94%",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}>
                                                        <Meta
                                                            avatar={<Avatar
                                                                src={`data:image/svg+xml;base64,${request.avatarImage}`}/>}
                                                            title={request.username}
                                                            description={request.message}
                                                            style={{width: "100%"}}
                                                        />
                                                        <div>

                                                        </div>
                                                    </div>
                                                </Card>
                                            })
                                        }
                                        {
                                            currentUser?.friendsRequest.length === 0 && <Card
                                                style={{
                                                    width: "100%",
                                                    // marginTop: 16,
                                                    // height: 100
                                                    // backgroundColor: "#9A9A9A",
                                                    // flexShrink: 1,
                                                    overflow: "hidden",
                                                    minWidth: 0,
                                                    backgroundColor: "gray",
                                                    border: "none",
                                                    display: "flex",
                                                    // justifyContent: "flex-start"

                                                }}
                                                // extra = {<div>add</div>}
                                                size="small"
                                            >
                                                <div style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    // flexShrink:0
                                                }}>
                                                        <div className="no-message">
                                                            <div><svg t="1702457836280" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5844" width="60" height="60"><path d="M475.829476 1024C551.912302 1024 611.780755 962.884287 611.780755 888.048721H339.878197c0 74.835566 61.115713 135.951279 135.951279 135.951279zM772.677223 140.940317c-102.275274 0-184.594397 63.610231-184.594397 143.434835 0 78.577345 82.319123 143.434836 184.594397 143.434836 102.275274 0 184.594397-63.610231 184.594397-143.434836s-82.319123-143.434836-184.594397-143.434835z m-87.308161 167.132765c-13.719854 0-23.697929-11.225335-23.697929-23.69793 0-13.719854 11.225335-23.697929 23.697929-23.697929 13.719854 0 23.697929 11.225335 23.697929 23.697929 1.247259 13.719854-9.978076 23.697929-23.697929 23.69793z m87.308161 0c-13.719854 0-23.697929-11.225335-23.697929-23.69793 0-13.719854 11.225335-23.697929 23.697929-23.697929s23.697929 11.225335 23.697929 23.697929c0 13.719854-9.978076 23.697929-23.697929 23.69793z m86.060901 0c-13.719854 0-23.697929-11.225335-23.697929-23.69793 0-13.719854 11.225335-23.697929 23.697929-23.697929s23.697929 11.225335 23.69793 23.697929c1.247259 13.719854-9.978076 23.697929-23.69793 23.69793z" fill="#E5E5E7" p-id="5845"></path><path d="M838.781973 750.850183c-44.90134 0-44.90134-180.852619-44.90134-180.852619V462.733252c-6.236297 0-13.719854 1.247259-19.956151 1.24726-122.231425 0-222.01218-81.071864-222.01218-180.852619 0-57.373934 33.676005-108.511571 86.060901-142.187576-22.45067-14.967113-46.148599-26.192448-72.341047-34.923265 1.247259-4.989038 1.247259-9.978076 1.247259-14.967113 0-49.890378-41.159562-91.049939-91.049939-91.049939s-91.049939 41.159562-91.049939 91.049939c0 4.989038 0 9.978076 1.24726 14.967113-125.973203 43.65408-228.248477 178.3581-228.248478 336.760049v124.725944s0 180.852619-43.65408 182.099878c-26.192448 0-46.148599 19.956151-46.1486 44.90134S87.93179 839.405603 112.876979 839.405603h725.904994c24.945189 0 44.90134-19.956151 44.90134-44.90134 1.247259-22.45067-19.956151-43.65408-44.90134-43.65408z m-361.705237-619.887942c-19.956151 0-37.417783-16.214373-37.417784-37.417783 0-19.956151 16.214373-37.417783 37.417784-37.417783 19.956151 0 37.417783 16.214373 37.417783 37.417783-1.247259 21.20341-17.461632 37.417783-37.417783 37.417783z" fill="#E5E5E7" p-id="5846"></path></svg></div>
                                                            <div>暂无通知</div>
                                                        </div>
                                                </div>
                                            </Card>
                                        }
                                    </div>

                                </OpenContainer2>
                            }
                        </> : <Container>
                            <div className="brand">
                                <div className="avatar">
                                    <img
                                        src={`data:image/svg+xml;base64,${currentAvatarImage}`}
                                        alt="avatar"
                                    />
                                </div>
                                <div onClick={() => handleOpen(0)}><UserSwitchOutlined/></div>
                                <div onClick={() => handleOpen(1)}><UserAddOutlined/></div>
                                <div onClick={() => {
                                    handleOpen(2)
                                    setIfNotice(false)
                                }} style={{display: "flex", alignItems: "center"}}>
                                    {ifNotice && <span className="alertAddUser">.</span>}
                                    <BellOutlined/></div>
                                {/*<img src={Logo} alt="logo"/>*/}
                                <h3>CHAT</h3>
                            </div>
                            <div className="contacts">
                                {contacts.map((contact, index) => {
                                    return (
                                        <div
                                            className={`contact ${
                                                currentSelected === index ? "selected" : ""
                                            }`}
                                            key={index}
                                            onClick={() => changeCurrentChat(index, contact)}
                                        >
                                            <div className="avatar">
                                                <img
                                                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                                                    alt="avatar"
                                                />
                                            </div>
                                            <div className="username">
                                                <h3>{contact.username}</h3>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/*<div className="current-user">*/}
                            {/*    <div className="avatar">*/}
                            {/*        <img*/}
                            {/*            src={`data:image/svg+xml;base64,${currentAvatarImage}`}*/}
                            {/*            alt="avatar"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*    <div className="username">*/}
                            {/*        <h2>{currentUsername}</h2>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </Container>
                    }
                </>
            )}
        </>
    );
};

export default Contacts;
const Container = styled.div`
  display: grid;
  grid-template-rows: 9.5% 90%;
  overflow: hidden;
  //background-color: #080420;
  background-color: gray;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    //min-width: 200px;
    //border-bottom: 1px solid #9A9A9A;
    box-shadow: 0 0 5px rgb(0, 0, 0, 0.5);
    @media screen  and (max-width: 1500px) {
      gap: 0.5rem;
    }

    img {
      height: 2rem;
    }

    h3 {
      margin-top: 5px;
      color: white;
      text-transform: uppercase;
    }

    div {
      color: white;
      cursor: pointer;
      font-size: 20px;
      opacity: 0.7;

      .alertAddUser {
        font-size: 30px;
        color: red;
        font-weight: 900;
        position: fixed;
        margin-left: 17px;
      }
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    //gap: 0.8rem;
    gap: 6px;
    padding: 8px 0 10px 0;

    &::-webkit-scrollbar {
      //width: 0.2rem;
      width: 0;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .contact {
      background-color: rgb(230, 206, 206, 0.09);
      min-height: 4rem;
      cursor: pointer;
      width: 88%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;

      &:hover {
        background-color: #ffffff34;
      }

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: white;
        }
      }
    }

    .selected {
      //background-color: #ffffff34;
      background-color: rgb(154, 154, 154);

    }
  }

  .current-user {
    background-color: #9A9A9A;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid gray;
    gap: 1rem;

    .avatar {
      img {
        height: 3rem;
        max-inline-size: 100%;
      }
    }

    .username {
      h2 {
        color: black;
      }
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
const OpenContainer = styled.div`
  background-color: gray;
  display: grid;
  grid-template-rows: 10% 90%;
  overflow: auto;

  .ant-btn {
    height: 31.33px;
  }

  .search {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    width: 95%;

    div {
      color: white;

    }
  }

  .userList {
    //background-color: red;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    overflow: hidden;
  }

`
const OpenContainer2 = styled.div`
  background-color: gray;
  display: flex;
  justify-content: center;
  gap: 10px;
  overflow: auto;
  .head {
    color: white;
    margin-top: 20px;
    margin-left: 10px;
  }

  .requestList {
    margin-top: 20px;
    flex: 1;
    display: flex;  
    flex-direction: column;
    gap: 10px;
    overflow: auto;
    margin-bottom: 20px;
    .ant-card.ant-card-bordered.ant-card-hoverable.ant-card-small.css-dev-only-do-not-override-6j9yrn {
     flex-shrink: 0; 
    }
    &::-webkit-scrollbar {
      //width: 0.2rem;
      width: 1px;

      &-thumb {
        background-color: #FFFAFA;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
  } 

  .no-message {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    margin-left: 30px;
    @media screen and (min-width: 1400px ) {
      margin-left: 3.1vw;
    }
  }

`
