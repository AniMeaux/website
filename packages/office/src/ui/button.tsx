import cn from "classnames";
import * as React from "react";

type ButtonVariant = "secondary" | "primary";
type ButtonColor = "default" | "blue" | "red";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  color?: ButtonColor;
  iconOnly?: boolean;
  refProp?: React.RefObject<HTMLButtonElement>;
};

export const ButtonClassName: {
  [key in ButtonVariant]: {
    [key in ButtonColor]: string;
  };
} = {
  secondary: {
    default: "bg-black bg-opacity-0 md:hover:bg-opacity-4",
    blue: "bg-blue-500 bg-opacity-5 md:hover:bg-opacity-10 text-blue-500",
    red: "bg-red-500 bg-opacity-5 md:hover:bg-opacity-10 text-red-500",
  },
  primary: {
    default: "",
    blue: "bg-blue-500 md:hover:bg-opacity-90 text-white",
    red: "",
  },
};

export function Button({
  variant = "secondary",
  color = "default",
  iconOnly = false,
  refProp,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      ref={refProp}
      className={cn(
        "a11y-focus disabled:opacity-75 h-10 flex items-center justify-center",
        ButtonClassName[variant][color],
        {
          "w-10 rounded-full": iconOnly,
          "rounded-md px-4 min-w-button text-sm uppercase tracking-wide font-medium": !iconOnly,
        },
        className
      )}
    />
  );
}

type ButtonWithConfirmationProps = ButtonProps & {
  confirmationMessage: string;
};

export function ButtonWithConfirmation({
  confirmationMessage,
  onClick,
  ...rest
}: ButtonWithConfirmationProps) {
  return (
    <Button
      {...rest}
      onClick={(event) => {
        if (window.confirm(confirmationMessage) && onClick != null) {
          onClick(event);
        }
      }}
    />
  );
}
