import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
    const fuc=()=>{
      setShowEmojiPicker(false);
      document.getElementsByClassName('chat-messages')[0].removeEventListener('click',fuc)  
    }
    document.getElementsByClassName('chat-messages')[0].addEventListener('click',fuc)
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };
  const sendChat=(event)=>{
        event.preventDefault();
        if(msg.length>0){
             handleSendMsg(msg);
             setMsg('')
        }
  }
  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(e)=>sendChat(e)}>
        <input
          type="text"
          // placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  //display: grid;
  //align-items: center;
  //grid-template-columns: 4% 96%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1vw;
  //background-color: rgb(56 50 60 / 43%);;
  padding: 0 1rem;
  //@media screen and (min-width: 720px) and (max-width: 1080px) {
  //  padding: 0 1rem;
  //  gap: 1rem;
  //}
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 2rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: gray;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: white;
        box-shadow: 0 5px 10px gray;
        border-color: white;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: white;
          width: 5px;
          &-thumb {
            background-color: white;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: white;
        }
        .emoji-group:before {
          background-color: white;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: white;
    border: 1px solid gray;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: black; 
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: white;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      //padding: 0.3rem 2rem;
      //border-radius: 2rem;
      //display: flex;
      //justify-content: center;
      //align-items: center;
      background-color: white; 
      margin-right: 0.9rem;
      border: none;
      //@media screen and (min-width: 720px) and (max-width: 1080px) {
      //  padding: 0.3rem 1rem;
      //  svg {
      //    font-size: 1rem;
      //  }
      //}
      svg {
        font-size: 2rem;
        color: gray;
      }
    }
  }
`;