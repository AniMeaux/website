import cn from "classnames";
import * as React from "react";
import { Link, LinkProps } from "../core";
import { Modal } from "../popovers";

const COMMON_CLASS_NAME =
  "focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-blue-500 bg-blue-500 active:bg-blue-700 text-white z-20 fixed quick-action-bottom quick-action-right rounded-full h-12 w-12 flex items-center justify-center text-2xl";

export function QuickLinkAction({ className, ...rest }: LinkProps) {
  return <Link {...rest} className={cn(COMMON_CLASS_NAME, className)} />;
}

type QuickActionsProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ElementType;
};

export function QuickActions({
  className,
  icon: Icon,
  children,
  ...rest
}: QuickActionsProps) {
  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <>
      <button
        {...rest}
        // Use type button to make sure we don't submit a form.
        type="button"
        onClick={(event) => {
          setIsOpened((isOpened) => !isOpened);
          rest.onClick?.(event);
        }}
        className={cn(COMMON_CLASS_NAME, className)}
      >
        <Icon />
      </button>

      <Modal
        open={isOpened}
        onDismiss={() => setIsOpened(false)}
        onClick={() => setIsOpened(false)}
      >
        {children}
      </Modal>
    </>
  );
}
