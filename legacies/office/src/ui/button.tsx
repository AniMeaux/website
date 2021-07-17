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
    [key in ButtonColor]: {
      base: string;
      enabled: string;
    };
  };
} = {
  secondary: {
    default: {
      base: "bg-black bg-opacity-0",
      enabled: "md:hover:bg-opacity-4",
    },
    blue: {
      base: "bg-blue-500 bg-opacity-5 text-blue-500",
      enabled: "md:hover:bg-opacity-10",
    },
    red: {
      base: "bg-red-500 bg-opacity-5 text-red-500",
      enabled: "md:hover:bg-opacity-10",
    },
  },
  primary: {
    default: {
      base: "",
      enabled: "",
    },
    blue: {
      base: "bg-blue-500 text-white",
      enabled: "md:hover:bg-opacity-90",
    },
    red: {
      base: "",
      enabled: "",
    },
  },
};

export function Button({
  variant = "secondary",
  color = "default",
  iconOnly = false,
  disabled = false,
  refProp,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      ref={refProp}
      disabled={disabled}
      className={cn(
        "a11y-focus disabled:opacity-75 disabled:cursor-auto h-10 flex items-center justify-center",
        ButtonClassName[variant][color].base,
        {
          [ButtonClassName[variant][color].enabled]: !disabled,
          "w-10 rounded-full": iconOnly,
          "rounded-md px-4 min-w-button text-sm uppercase tracking-wide font-medium":
            !iconOnly,
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
