import styled from "styled-components";
import { theme } from "styles/theme";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  isOptional?: boolean;
  hasError?: boolean;
};

export function Label({
  isOptional = false,
  hasError = false,
  children,
  ...rest
}: LabelProps) {
  return (
    <Container {...rest} $hasError={hasError}>
      {children}
      {isOptional && " (Optionnel)"}
    </Container>
  );
}

const Container = styled.label<{ $hasError: boolean }>`
  padding: 0 ${theme.spacing.x4};
  font-size: 14px;
  color: ${(props) =>
    props.$hasError ? theme.colors.alert[500] : theme.colors.text.secondary};
`;
