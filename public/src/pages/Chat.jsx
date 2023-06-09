import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { allUserRoute, host } from "../utils/ApIRouters";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts";
import Welecome from "../components/Welecome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
const Chat = () => {
  const socket = useRef()
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  useEffect(() => {
    const getCurrentUser = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        const user = JSON.parse(await localStorage.getItem("chat-app-user"));
        setCurrentUser(user);
      }
    };
    getCurrentUser();
  }, [navigate]);
  useEffect(() => {
    if (currentUser) {
      socket.current=io(host)//使连接到服务端127.0.0.1:5000
      socket.current.emit("add-user",currentUser._id)
    }
  }, [currentUser]);
  useEffect(() => {
    const loadContacts = async () => {
      const { data } = await axios.get(`${allUserRoute}/${currentUser._id}`);
      setContacts(data);
      // console.log(data);
    };
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        loadContacts();
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser,navigate]);
  const handleChatChange = (chat) => {
    socket.current.off("msg-recieve")
    setCurrentChat(chat);
  };
  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            contacts={contacts}
            currentUser={currentUser}
            changeChat={handleChatChange}
          />
          {currentChat === undefined ? (
            <Welecome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentUser={currentUser}
              currentChat={currentChat}
              socket={socket}
            />
          )}
        </div>
      </Container>
    </>
  );
};

export default Chat;
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column; //纵向主轴
  justify-content: center; //主轴居中
  gap: 1rem;
  align-items: center; //辅轴居中
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and(min-width:720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
