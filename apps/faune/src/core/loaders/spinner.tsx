import { StyleProps } from "core/types";
import styled, { keyframes } from "styled-components";
import { theme } from "styles/theme";

type SpinnerProps = StyleProps;

export function Spinner(props: SpinnerProps) {
  return (
    <SpinnerContainer {...props}>
      <SvgElement
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="1, 300"
        strokeDashoffset="0"
      >
        <circle strokeWidth="8" cx="33" cy="33" r="28" />
      </SvgElement>
    </SpinnerContainer>
  );
}

const AnimationSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 1em;
  height: 1em;
  animation-name: ${AnimationSpin};
  animation-duration: 1.5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

const AnimationStroke = keyframes`
  0% {
    stroke-dasharray: 1, 300;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 150, 300;
    /* Yep, that's right! */
    /* Computed by: circle.getTotalLength(). */
    stroke-dashoffset: -175.6449737548828 / 4;
  }

  100% {
    stroke-dasharray: 150, 300;
    stroke-dashoffset: -175.6449737548828;
  }
`;

const SvgElement = styled.svg`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform-origin: center;
  animation-name: ${AnimationStroke};
  animation-duration: 2s;
  animation-timing-function: ${theme.animation.ease.move};
  animation-iteration-count: infinite;
`;
