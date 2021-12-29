import { cloneElement } from "react";
import styled, {
  css,
  FlattenSimpleInterpolation,
  keyframes,
} from "styled-components/macro";
import { theme } from "styles/theme";

export type PlaceholderPreset =
  | "avatar"
  | "avatar-small"
  | "icon"
  | "image"
  | "input"
  | "label"
  | "selector"
  | "text";

type PlaceholderProps = React.HTMLAttributes<HTMLSpanElement> & {
  preset: PlaceholderPreset;
};

export function Placeholder({ preset, ...rest }: PlaceholderProps) {
  return <PlaceholderElement {...rest} $preset={preset} />;
}

const AnimationPulse = keyframes`
  0% {
    background-position: -1000px 0;
  }

  100% {
    background-position: 1000px 0;
  }
`;

const PRESET_STYLES: Record<PlaceholderPreset, FlattenSimpleInterpolation> = {
  avatar: css`
    width: 2em;
    height: 2em;
  `,
  "avatar-small": css`
    font-size: 14px;
  `,
  icon: css`
    width: 1em;
    height: 1em;
  `,
  image: css`
    overflow: hidden;
  `,
  input: css`
    height: 40px;
  `,
  label: css`
    width: 25%;
  `,
  selector: css`
    width: 112px;
    height: 40px;
  `,
  text: css`
    width: 75%;
  `,
};

const PRESET_PULSE_HEIGHT: Partial<Record<PlaceholderPreset, string>> = {
  avatar: "100%",
  icon: "100%",
  image: "100%",
};

const PlaceholderElement = styled.span<{ $preset: PlaceholderPreset }>`
  position: relative;
  width: 100%;
  display: inline-flex;
  align-items: center;

  &::before {
    /* Display some text to make sure to have the correct height when it is
     * set to "auto". */
    content: ".";
    opacity: 0;
  }

  &::after {
    position: absolute;
    width: 100%;
    display: inline-block;
    border-radius: ${theme.borderRadius.full};
    content: "";
    height: ${(props) => PRESET_PULSE_HEIGHT[props.$preset] ?? "70%"};
    background: linear-gradient(
      to right,
      rgba(237, 237, 237, 0.2),
      rgba(129, 129, 129, 0.2) 50%,
      rgba(237, 237, 237, 0.2)
    );
    background-size: 1000px auto;
    animation-duration: 3s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: ${AnimationPulse};
    animation-timing-function: linear;
  }

  ${(props) => PRESET_STYLES[props.$preset]};
`;

type PlaceholdersProps = {
  count?: number;
  children: React.ReactElement;
};

export function Placeholders({ count = 3, children }: PlaceholdersProps) {
  let placeholders: React.ReactElement[] = [];

  for (let index = 0; index < count; index++) {
    placeholders.push(cloneElement(children, { key: index }));
  }

  return <>{placeholders}</>;
}
