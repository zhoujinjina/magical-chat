import React from "react";
import Robot from "../assets/robot.gif";
import styled from "styled-components";
const Welecome = ({ currentUser }) => {
  return (
    <>
      {currentUser && (
        <Container>
          <img src={Robot} alt="Robot" />
          <h1>
            Welcome,<span>{currentUser.username}!</span>
          </h1>
          <h3>Please select a chat to Start Messaging.</h3>
        </Container>
      )}
    </>
  );
};

export default Welecome;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  background-color: #9A9A9A;
  img {
    height: 20rem;
  }
  span {
    color: #4e00ff;
  }
`;
