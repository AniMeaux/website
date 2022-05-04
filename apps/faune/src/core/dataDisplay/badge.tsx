import styled from "styled-components";
import { theme } from "~/styles/theme";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  isVisible: boolean;
};

export function Badge({ isVisible, children, ...rest }: BadgeProps) {
  return (
    <Container {...rest}>
      {children}
      {isVisible && <BadgeElement />}
    </Container>
  );
}

const Container = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BadgeElement = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate3d(50%, -50%, 0);
  width: 12px;
  height: 12px;
  border: 2px solid ${theme.colors.background.primary};
  background: ${theme.colors.primary[500]};
  border-radius: ${theme.borderRadius.full};
`;
