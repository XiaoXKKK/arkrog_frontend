import { styled } from "styled-components";

export const StyledModalContent = styled.div`
  background: black;
  padding: 1.5rem 1rem;
  z-index: 1;
  min-height: 15rem;
  &::before {
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    background-image: url("/images/bg/02.png");
    background-repeat: repeat-y;
    background-size: 100% auto;
    background-position: 25% 0;
    height: 100%;
    width: 100%;
    opacity: 0.6;
    z-index: -1;
  }
`;
