import React from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {BiPowerOff} from 'react-icons/bi'
const Logout = () => {
    const navigate=useNavigate()
    const handleOnclick=()=>{
        localStorage.clear()
        navigate('/login')
    }
  return (
    <Button onClick={handleOnclick}>
      <BiPowerOff />
    </Button>
  )
}

export default Logout
const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9A9A9A;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;