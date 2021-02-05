import cn from "classnames";
import * as React from "react";
import { Section } from "./layouts";
import { Link, LinkProps } from "./link";
import { BottomSheet } from "./popovers";

export function QuickLinkAction({ className, ...rest }: LinkProps) {
  return (
    <Link
      {...rest}
      className={cn(
        "focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-blue-500 bg-blue-500 active:bg-blue-700 text-white z-20 fixed bottom-18 right-4 rounded-full h-12 w-12 flex items-center justify-center text-2xl",
        className
      )}
    />
  );
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
        className={cn(
          "focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-blue-500 bg-blue-500 active:bg-blue-700 text-white z-20 fixed bottom-18 right-4 rounded-full h-12 w-12 flex items-center justify-center text-2xl",
          className
        )}
      >
        <Icon />
      </button>

      <BottomSheet
        open={isOpened}
        onDismiss={() => setIsOpened(false)}
        snapPoints={({ minHeight }) => [minHeight]}
        defaultSnap={({ minHeight }) => minHeight}
      >
        {children}
      </BottomSheet>
    </>
  );
}
