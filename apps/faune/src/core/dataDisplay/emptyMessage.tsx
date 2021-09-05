import { ChildrenProp, StyleProps } from "core/types";
import styled from "styled-components/macro";
import { theme } from "styles/theme";

export type EmptyMessageProps = ChildrenProp &
  StyleProps & {
    action?: React.ReactNode;
  };

export function EmptyMessage({ children, action, ...rest }: EmptyMessageProps) {
  return (
    <Container {...rest}>
      <Text>{children}</Text>
      {action}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  max-width: 100%;
  padding: ${theme.spacing.x8} ${theme.spacing.x4};
`;
