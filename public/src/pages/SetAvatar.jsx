import React, { useEffect, useState } from "react";
import styled from "styled-components";
import loader from "../assets//loader.gif";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Buffer } from "buffer";
import axios from "axios";
import { setAvatarRoute } from "../utils/ApIRouters";
const SetAvatar = () => {
  const api = "https://api.multiavatar.com/4645646";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(()=>{
    if(!localStorage.getItem('chat-app-user')){
      navigate('/login')
    }
  })
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const image = await axios.get(
            `${api}/${Math.round(Math.random() * 10000)}`
          );
          //png格式
          const buffer = Buffer.from(image.data);
          data.push(buffer.toString("base64"));
        }
        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    loadAvatar();
  }, []);
const setProfilePicture=async()=>{
 try {
  if(selectedAvatar===undefined){
    toast.error('Please select your profile picture',toastOptions)
   }else{
    const user=await JSON.parse(localStorage.getItem('chat-app-user'))
    const {data} = await axios.post(`${setAvatarRoute}/${user._id}`,{
      image:avatars[selectedAvatar]
    })
    if(data.isSet){
      user.isAvatarImageSet=true
      user.avatarImage=data.image
      localStorage.setItem('chat-app-user',JSON.stringify(user))
      navigate('/')
    }
   }
 } catch (error) {
  console.log(error.message)
 }
   
}
  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <>
        <Container>
          <div className="title-container">
            <h1>Pick an avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${selectedAvatar === index?"selected":""}`}
                  key={index}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>Set as Profile Picture</button>
        </Container>
        <ToastContainer />
        </>
      )}
    </>
  );
};

export default SetAvatar;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
