import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { allUserRoute } from "../utils/ApIRouters";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    const getCurrentUser = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        const user=JSON.parse(await localStorage.getItem("chat-app-user"))
        setCurrentUser(user);
      }
    };
    getCurrentUser();
  }, []);
  useEffect(() => {
    const loadContacts = async () => {
      const { data } = await axios.get(`${allUserRoute}/${currentUser._id}`);
      setContacts(data)
      console.log(data);
    };
    if(currentUser){
      loadContacts();
    }
  }, [currentUser]);
  return (
    <>
      <Container>
        <div className="container">chat</div>
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
