import cn from "classnames";
import { Link, LinkProps } from "core/link";
import { Modal } from "core/popovers/modal";
import { ChildrenProp, StyleProps } from "core/types";
import * as React from "react";

export function QuickLinkAction({ className, ...rest }: LinkProps) {
  return <Link {...rest} className={cn("QuickAction", className)} />;
}

type QuickActionsProps = ChildrenProp &
  StyleProps & {
    icon: React.ElementType;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };

export function QuickActions({
  className,
  icon: Icon,
  children,
  onClick,
  ...rest
}: QuickActionsProps) {
  const [isOpened, setIsOpened] = React.useState(false);
  const buttonElement = React.useRef<HTMLButtonElement>(null!);

  return (
    <>
      <button
        {...rest}
        // Use type button to make sure we don't submit a form.
        type="button"
        onClick={(event) => {
          onClick?.(event);
          if (!event.isDefaultPrevented()) {
            setIsOpened((isOpened) => !isOpened);
          }
        }}
        className={cn("QuickAction", className)}
        ref={buttonElement}
      >
        <Icon />
      </button>

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
