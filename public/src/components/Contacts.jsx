import React, {useEffect, useState} from "react";
import Logo from "../assets/logo.svg";
import styled from "styled-components";
import {ArrowLeftOutlined, BellOutlined, QqOutlined, UserAddOutlined, UserSwitchOutlined} from "@ant-design/icons"
import { Input } from 'antd';
const { Search } = Input;
const Contacts = ({contacts, currentUser, changeChat}) => {
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [currentUsername, setCurrentUsername] = useState(undefined);
    const [currentAvatarImage, setCurrentAvatarImage] = useState('');
    const [open, setOpen] = useState(false)
    const [select, setSelect] = useState("")
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
            case 0 : setSelect(""); break;
            case 1 : setSelect("addUser"); break;
            case 2 : setSelect("message"); break;
        }
    }
    const onSearch = (value, _e, info) => console.log(info?.source, value, _e);
    return (
        <>
            {contacts && currentUser && (
                <>
                    {
                        open ? <OpenContainer>
                            {
                                select === "addUser" && <div className="open">
                                <div className="search">
                                    <div ><ArrowLeftOutlined onClick={() => setOpen(false)} /></div>
                                    <Search
                                        placeholder="input search text"
                                        onSearch={onSearch}
                                        style={{
                                            width: 200,
                                        }}
                                    />
                                </div>
                                </div>

                            }
                            {
                                select === "message" && <div className="open"><ArrowLeftOutlined onClick={() => setOpen(false)}/>通知</div>
                            }
                            {
                                select === "" && <div className="open"><ArrowLeftOutlined onClick={() => setOpen(false)} />切换登录</div>
                            }
                        </OpenContainer> : <Container>
                            <div className="brand">
                                <div onClick={() => handleOpen(0)}><UserSwitchOutlined/></div>
                                <div onClick={() => handleOpen(1)}><UserAddOutlined/></div>
                                <div onClick={() => handleOpen(2)}><BellOutlined/><span className="alertAddUser">.</span></div>
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
                            <div className="current-user">
                                <div className="avatar">
                                    <img
                                        src={`data:image/svg+xml;base64,${currentAvatarImage}`}
                                        alt="avatar"
                                    />
                                </div>
                                <div className="username">
                                    <h1>{currentUsername}</h1>
                                </div>
                            </div>
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
  grid-template-rows: 10% 78% 12%;
  overflow: hidden;
  //background-color: #080420;
  background-color: gray;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 2rem;
    }

    h3 {
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
      }
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .contact {
      background-color: #ffffff34;
      min-height: 4rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;

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
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: lightgoldenrodyellow;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    .avatar {
      img {
        height: 3rem;
        max-inline-size: 100%;
      }
    }

    .username {
      h2 {
        color: white;
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
  .ant-btn {
    height: 31.33px;
   }
 .search {
   display: flex;
   margin-top: 10px;
   gap: 10px;
   justify-content: center;
   align-items: center;
   div {
     color: white;
   }
 }
`
