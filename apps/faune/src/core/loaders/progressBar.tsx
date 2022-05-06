import styled, { keyframes } from "styled-components";
import { theme } from "~/styles/theme";

const AnimationLong = keyframes`
  0% {
    left: -35%;
    right: 100%;
  }

  60% {
    left: 100%;
    right: -90%;
  }

  100% {
    left: 100%;
    right: -90%;
  }
`;

const AnimationShort = keyframes`
  0% {
    left: -200%;
    right: 100%;
  }

  60% {
    left: 107%;
    right: -8%;
  }

  100% {
    left: 107%;
    right: -8%;
  }
`;

export const ProgressBar = styled.div`
  z-index: ${theme.zIndex.progressBar};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  display: block;
  background-clip: padding-box;
  overflow: hidden;

  &::before {
    content: "";
    background-color: ${theme.colors.primary[500]};
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    animation-name: ${AnimationLong};
    animation-duration: 2s;
    animation-timing-function: cubic-bezier(0.65, 0.815, 0.735, 0.395);
    animation-iteration-count: infinite;
  }

  &::after {
    content: "";
    background-color: ${theme.colors.primary[500]};
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    animation-name: ${AnimationShort};
    animation-duration: 2s;
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
    animation-iteration-count: infinite;
    animation-delay: 1.15s;
  }
`;
