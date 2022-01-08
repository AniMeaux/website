import { ChildrenProp, StyleProps } from "core/types";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { theme } from "styles/theme";

type InfoVariant = "info" | "warning" | "error";

type InfoProps = ChildrenProp &
  StyleProps & {
    variant: InfoVariant;
    icon?: React.ReactNode;
  };

export function Info({ variant, icon, children, ...rest }: InfoProps) {
  return (
    <Container {...rest} $variant={variant}>
      {icon != null && <Icon>{icon}</Icon>}
      <Message>{children}</Message>
    </Container>
  );
}

const VARIANT_STYLES: Record<InfoVariant, FlattenSimpleInterpolation> = {
  info: css`
    background: ${theme.colors.primary[50]};
    color: ${theme.colors.primary[500]};
    font-weight: 500;
  `,
  error: css`
    background: ${theme.colors.alert[50]};
    color: ${theme.colors.alert[500]};
    font-weight: 500;
  `,
  warning: css`
    background: ${theme.colors.warning[100]};
  `,
};

const Container = styled.div<{ $variant: InfoVariant }>`
  ${(props) => VARIANT_STYLES[props.$variant]};
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.x3};
  padding: ${theme.spacing.x4};
  border-radius: ${theme.borderRadius.m};
`;

const Icon = styled.span`
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Message = styled.p`
  line-height: ${theme.typography.lineHeight.multiLine};
`;
