import { Button, ButtonProps } from "core/actions/button";
import { Link } from "core/actions/link";
import { ActionCommonProps } from "core/actions/shared";
import { Modal } from "core/popovers/modal";
import { useRef, useState } from "react";
import styled, { css } from "styled-components/macro";
import { theme } from "styles/theme";

const SPACING = theme.spacing.x4;
const SPACING_BOTTOM = `calc(${theme.components.bottomNavHeight} + ${SPACING})`;

const QUICK_ACTION_PROPS: ActionCommonProps = {
  variant: "primary",
};

const QUICK_ACTION_STYLES = css`
  position: fixed;
  bottom: ${SPACING_BOTTOM};
  bottom: calc(${SPACING_BOTTOM} + env(safe-area-inset-bottom, 0));
  right: ${SPACING};
  right: calc(${SPACING} + env(safe-area-inset-right, 0));
  z-index: ${theme.zIndex.navigation};
  box-shadow: ${theme.shadow.m};
  width: 2em;
  height: 2em;
  padding: ${theme.spacing.x2};
  font-size: 30px;
`;

export const QuickLinkAction = styled(Link).attrs(QUICK_ACTION_PROPS)`
  ${QUICK_ACTION_STYLES};
`;

type QuickActionsProps = Omit<ButtonProps, "type"> & {
  icon: React.ReactNode;
};

export function QuickActions({
  icon,
  children,
  onClick,
  ...rest
}: QuickActionsProps) {
  const [isOpened, setIsOpened] = useState(false);
  const buttonElement = useRef<HTMLButtonElement>(null!);

  return (
    <>
      <QuickButtonAction
        {...rest}
        // Use type button to make sure we don't submit a form.
        type="button"
        onClick={(event) => {
          onClick?.(event);
          if (!event.isDefaultPrevented()) {
            setIsOpened((isOpened) => !isOpened);
          }
        }}
        ref={buttonElement}
      >
        {icon}
      </QuickButtonAction>

      <Modal
        open={isOpened}
        onDismiss={() => setIsOpened(false)}
        referenceElement={buttonElement}
        placement="top-end"
      >
        {children}
      </Modal>
    </>
  );
}

const QuickButtonAction = styled(Button).attrs(QUICK_ACTION_PROPS)`
  ${QUICK_ACTION_STYLES};
`;
