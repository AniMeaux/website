import { BaseLink, BaseLinkProps } from "core/baseLink";
import { FaCheckCircle, FaCircle, FaDotCircle } from "react-icons/fa";
import styled, { css } from "styled-components/macro";
import { ELLIPSIS_STYLES, Styles, theme } from "styles/theme";

export type StepStatus = "pending" | "in-progress" | "done";

export const Stepper = styled.ul`
  padding: ${theme.spacing.x4} 0;
  display: flex;
  align-items: center;
`;

const STATUS_ICONS: Record<StepStatus, React.ReactNode> = {
  pending: <FaCircle />,
  "in-progress": <FaDotCircle />,
  done: <FaCheckCircle />,
};

type StepProps = Omit<BaseLinkProps, "disabled"> & {
  status: StepStatus;
};

export function Step({
  status,
  children,
  className,
  style,
  ...rest
}: StepProps) {
  return (
    <Item className={className} style={style} $status={status}>
      <Link {...rest} $status={status} disabled={status === "pending"}>
        <Icon $status={status}>{STATUS_ICONS[status]}</Icon>
        <Label>{children}</Label>
      </Link>
    </Item>
  );
}

const ICON_SIZE = "24px";
const LINK_PADDING = theme.spacing.x2;

const ITEM_STATUS_STYLES: Record<StepStatus, Styles> = {
  done: css`
    background: ${theme.colors.primary[500]};
  `,
  "in-progress": css`
    background: ${theme.colors.primary[500]};
  `,
  pending: css`
    background: ${theme.colors.dark[100]};
  `,
};

const Item = styled.li<{ $status: StepStatus }>`
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:not(:first-child)::before {
    ${(props) => ITEM_STATUS_STYLES[props.$status]};
    content: "";
    position: absolute;
    top: calc(${ICON_SIZE} / 2 + ${LINK_PADDING});
    left: 0;
    transform: translate3d(-50%, -50%, 0);
    width: calc(100% - (${ICON_SIZE} + 2 * ${LINK_PADDING}));
    height: 4px;
    border-radius: ${theme.borderRadius.full};
  }
`;

const Link = styled(BaseLink)<{ $status: StepStatus }>`
  max-width: 100%;
  padding: ${LINK_PADDING};
  border-radius: ${theme.borderRadius.m};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ICON_STATUS_STYLES: Record<StepStatus, Styles> = {
  done: css`
    color: ${theme.colors.primary[500]};
  `,
  "in-progress": css`
    color: ${theme.colors.primary[500]};
  `,
  pending: css`
    color: ${theme.colors.dark[100]};
  `,
};

const ICON_STATUS_HOVER_STYLES: Record<StepStatus, Styles> = {
  done: css`
    color: ${theme.colors.primary[400]};
  `,
  "in-progress": css`
    color: ${theme.colors.primary[400]};
  `,
  pending: css``,
};

const Icon = styled.span<{ $status: StepStatus }>`
  ${(props) => ICON_STATUS_STYLES[props.$status]};
  margin-bottom: ${theme.spacing.x1};
  font-size: ${ICON_SIZE};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (hover: hover) {
    ${Link}:not([aria-disabled]):hover & {
      ${(props) => ICON_STATUS_HOVER_STYLES[props.$status]};
    }
  }
`;

const Label = styled.span`
  ${ELLIPSIS_STYLES};
  max-width: 100%;
  font-size: 12px;
  line-height: ${theme.typography.lineHeight.monoLine};
  color: ${theme.colors.text.secondary};
`;
