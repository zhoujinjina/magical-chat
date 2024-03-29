import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import axios from "axios";
import {deleteUser, getAllMessage, sendMessagesRoute} from "../utils/ApIRouters";
import {DeleteOutlined} from "@ant-design/icons";
import {message, Popconfirm} from "antd";
const ChatContainer = ({ currentChat, currentUser, socket, setCurrentUser,setCurrentChat }) => {
  const [allMessages, setAllMessages] = useState([]);
  const scrollRef = useRef();
  const handleSendMsg = async (msg) => {
    setAllMessages([...allMessages, { fromSelf: true, message: msg }]);
    axios
      .post(sendMessagesRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      })
      .catch((err) => console.log(err));
    socket.current.emit("send-msg", {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviou: "smooth" });
  }, [allMessages]);
  useEffect(() => {
    const getAllMessages = async () => {
      axios
        .post(getAllMessage, {
          to: currentChat._id,
          from: currentUser._id,
        })
        .then(
          (data) => setAllMessages(data.data.data),
          (err) => console.log(err)
        );
    };
    getAllMessages();
    // console.log("66")
  }, [currentChat,currentUser._id,socket]);

  useEffect(() => {

    if (socket.current) {
      //判断是否来自目前聊天的用户，要是非正在聊天的用户发的 则不更新聊天记录
      socket.current.on("msg-recieve", (data) => {
        if(data.from!==currentChat._id) {return}
        else{
          setAllMessages([
            ...allMessages,
            { fromSelf: false, message: data.message },
          ]);
        }
        
      });
    }
    // console.log("88")
  }, [currentChat, allMessages,socket]);
  const confirm = (e) => {
    console.log(e);
    console.log(currentUser.username,currentChat.username)
    axios.post(deleteUser,{currentUser:currentUser.username,currentChat:currentChat.username}).then(r => {
      console.log(r.data.userDetail)
      setCurrentUser(r.data.userDetail)
      localStorage.setItem("chat-app-user", JSON.stringify(r.data.userDetail));
      message.success('删除成功');
      socket.current.emit("deleteUser",{notice:currentChat.username,other:currentUser.username})
      setCurrentChat(undefined)
    })
  };
  return (
    <>
      <Container>
        <div className="chat-header" style={{boxShadow: " 0 0 0.5px 0 "}}>
          <div className="user-details">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                alt=""
              />
            </div>
            <div className="username">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
          <div className="action-button">

              <Popconfirm
                  title="提醒"
                  description="你确定要删除该联系人？"
                  onConfirm={confirm}
                  // onCancel={cancel}
                  okText="确定"
                  cancelText="取消"
              ><div className="delete-chat">
                <DeleteOutlined />
              </div>
              </Popconfirm>
            <div className="logout-chat"><Logout /></div>
          </div>
        </div>
        <div className="chat-messages">
          {allMessages.map((message, index) => {
            return (
              <div ref={scrollRef} key={index}>
                <div
                  className={`message ${
                    message.fromSelf === true ? "sended" : "recieved"
                  }`}
                >
                  {message.fromSelf ? (
                    <>
                      <div className="content ">
                        <p>{message.message}</p>
                      </div>
                      <div className="chat-header">
                        <div className="user-details">
                          <div className="avatar">
                            {message.fromSelf ? (
                              <img
                                style={{ marginRight: 0 }}
                                src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                                alt=""
                              />
                            ) : (
                              <img
                                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                                alt=""
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="chat-header">
                        <div className="user-details">
                          <div className="avatar">
                            {message.fromSelf ? (
                              <img
                                style={{ marginRight: 0 }}
                                src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                                alt=""
                              />
                            ) : (
                              <img
                                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                                alt=""
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="content ">
                        <p>{message.message}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <ChatInput handleSendMsg={handleSendMsg} />
      </Container>
    </>
  );
};

export default ChatContainer;
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  background-color: rgb(245,245,245);
  //@media screen and (min-width: 720px) and (max-width: 1080px) {
  //  grid-template-rows: 15% 70% 15%;
  //}
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;  
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: black;
        }
      }
    }
    .action-button {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      .delete-chat {
        padding: 0.581rem;
        border-radius: 0.5rem;
        color: #ebe7ff;
        background-color: #9A9A9A;
        border: none;
        cursor: pointer;
        font-size: 1.05rem;
      }
    }
  }
  .chat-messages {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: black;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: rgb(124,255,58);
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: white;
      }
    }
  }
`;
