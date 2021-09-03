import cn from "classnames";
import { BaseLink, BaseLinkProps } from "core/baseLink";
import { Modal } from "core/popovers/modal";
import { ChildrenProp, StyleProps } from "core/types";
import { useRef, useState } from "react";

export function QuickLinkAction({ className, ...rest }: BaseLinkProps) {
  return <BaseLink {...rest} className={cn("QuickAction", className)} />;
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
  const [isOpened, setIsOpened] = useState(false);
  const buttonElement = useRef<HTMLButtonElement>(null!);

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
