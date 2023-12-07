import React, {useEffect, useState} from "react";
import Logo from "../assets/logo.svg";
import styled from "styled-components";
import {
    ArrowLeftOutlined,
    BellOutlined, EditOutlined, EllipsisOutlined,
    QqOutlined,
    SettingOutlined, TeamOutlined,
    UserAddOutlined,
    UserSwitchOutlined
} from "@ant-design/icons"
import {Avatar, Card, Input, Result, Skeleton} from 'antd';
import {searchUser} from "../utils/ApIRouters";
import axios from "axios";
import Meta from "antd/es/card/Meta";

const {Search} = Input;
const Contacts = ({contacts, currentUser, changeChat}) => {
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [currentUsername, setCurrentUsername] = useState(undefined);
    const [currentAvatarImage, setCurrentAvatarImage] = useState('');
    const [open, setOpen] = useState(false)
    const [select, setSelect] = useState("")
    const [searchUsers, setSearchUsers] = useState(undefined)
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
                setSelect("");
                break;
            case 1 :
                setSelect("addUser");
                break;
            case 2 :
                setSelect("message");
                break;
        }
    }
    const onSearch = (value, _e, info) => {
        console.log(info?.source, value, _e);
        axios.get(`${searchUser}/${value}`).then(r => setSearchUsers(r.data.userDetail)).catch(e => console.log(e))
    }
    return (
        <>
            {contacts && currentUser && (
                <>
                    {
                        open ? <OpenContainer>
                            {
                                select === "addUser" && <>
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
                                                    <div style={{fontSize: 50, color: "#00000052"}}><TeamOutlined /></div>
                                                    <div style={{color: "#2c2121cc"}}>未找到相关用户</div>
                                                </> : <>
                                                    {
                                                        searchUsers.map(user => {
                                                            return <Card
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
                                                                        avatar={<Avatar src={`data:image/svg+xml;base64,${user.avatarImage}`}/>}
                                                                        title={user.username}
                                                                        description={<div style={{
                                                                            display: "flex",
                                                                            justifyContent: "center",
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
                                                                            <div style={{overflow: "hidden", }}>{`:${user.email}`}</div>
                                                                        </div>}
                                                                        style={{width: "100%"}}
                                                                    />
                                                                    <div><UserAddOutlined/></div>
                                                                </div>
                                                            </Card>
                                                        })
                                                    }
                                                </>
                                        }
                                    </div>
                                </>

                            }
                            {
                                select === "message" &&
                                <div className="open"><ArrowLeftOutlined onClick={() => setOpen(false)}/>通知</div>
                            }
                            {
                                select === "" &&
                                <div className="open"><ArrowLeftOutlined onClick={() => setOpen(false)}/>切换登录</div>
                            }
                        </OpenContainer> : <Container>
                            <div className="brand">
                                <div className="avatar">
                                    <img
                                        src={`data:image/svg+xml;base64,${currentAvatarImage}`}
                                        alt="avatar"
                                    />
                                </div>
                                <div onClick={() => handleOpen(0)}><UserSwitchOutlined/></div>
                                <div onClick={() => handleOpen(1)}><UserAddOutlined/></div>
                                <div onClick={() => handleOpen(2)} style={{display: "flex", alignItems: "center"}}>
                                    <BellOutlined/><span className="alertAddUser">.</span></div>
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
  grid-template-rows: 10% 90%;
  overflow: hidden;
  //background-color: #080420;
  background-color: gray;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    //min-width: 200px;
    @media screen  and (max-width: 1500px) {
      gap: 0.5rem;
    }

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
      width: 88%;
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
  overflow: hidden;

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
