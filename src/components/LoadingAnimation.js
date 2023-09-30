import React from "react";
import styled, { keyframes } from "styled-components";

//styled-components
const rotateAnimation = keyframes`
from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Rotate = styled.div`
  display: inline-block;
  animation: ${rotateAnimation} 1.5s linear infinite;
  margin: 2em 0;
  font-size: 3rem;
  margin-left: 50%;
  transform: translateX(-50%);
`;

export default function LoadingAnimation({ symbol }) {
  return <Rotate>{symbol}</Rotate>;
}
