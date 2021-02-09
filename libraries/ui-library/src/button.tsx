import cn from "classnames";
import * as React from "react";
import { Link, LinkProps } from "./link";

type ButtonSize = "small" | "medium";
type ButtonVariant = "secondary" | "primary" | "outlined";
type ButtonColor = "default" | "blue" | "red";

const ButtonSizeClassName: {
  [key in ButtonSize]: {
    base: string;
    iconOnly: string;
    notIconOnly: string;
  };
} = {
  small: {
    base: "h-8",
    iconOnly: "w-8",
    notIconOnly: "text-xs",
  },
  medium: {
    base: "h-10",
    iconOnly: "w-10",
    notIconOnly: "min-w-button text-sm",
  },
};

export const ButtonClassName: {
  [key in ButtonVariant]: {
    [key in ButtonColor]: {
      base: string;
    };
  };
} = {
  secondary: {
    default: {
      base: "focus-visible:ring-blue-500 bg-white active:bg-gray-100",
    },
    blue: {
      base:
        "focus-visible:ring-blue-500 bg-blue-500 bg-opacity-5 active:bg-opacity-10 text-blue-500",
    },
    red: {
      base:
        "focus-visible:ring-red-500 bg-red-500 bg-opacity-5 active:bg-opacity-10 text-red-500",
    },
  },
  primary: {
    default: {
      base: "focus-visible:ring-blue-500",
    },
    blue: {
      base:
        "focus-visible:ring-blue-500 bg-blue-500 active:bg-blue-700 text-white",
    },
    red: {
      base:
        "focus-visible:ring-red-500 bg-red-500 active:bg-red-700 text-white",
    },
  },
  outlined: {
    default: {
      base: "focus-visible:ring-blue-500 bg-white active:bg-gray-100 border",
    },
    blue: {
      base: "focus-visible:ring-blue-500",
    },
    red: {
      base: "focus-visible:ring-red-500",
    },
  },
};

type ButtonPropsForClassName = {
  size?: ButtonSize;
  variant?: ButtonVariant;
  color?: ButtonColor;
  iconOnly?: boolean;
  className?: string;
};

function getButtonClassName({
  size = "medium",
  variant = "secondary",
  color = "default",
  iconOnly = false,
  className,
}: ButtonPropsForClassName) {
  return cn(
    "focus:outline-none focus-visible:ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-auto rounded-full flex items-center justify-center",
    ButtonClassName[variant][color].base,
    ButtonSizeClassName[size].base,
    {
      [ButtonSizeClassName[size].iconOnly]: iconOnly,
      "px-4 uppercase tracking-wide font-medium": !iconOnly,
      [ButtonSizeClassName[size].notIconOnly]: !iconOnly,
    },
    className
  );
}

type BaseButtonProps = {
  size?: ButtonSize;
  variant?: ButtonVariant;
  color?: ButtonColor;
  iconOnly?: boolean;
  refProp?: React.RefObject<HTMLButtonElement>;
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  BaseButtonProps;

export function Button({
  size,
  variant,
  color,
  iconOnly,
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
      className={getButtonClassName({
        size,
        className,
        color,
        iconOnly,
        variant,
      })}
    />
  );
}

export type ButtonWithConfirmationProps = ButtonProps & {
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

export type ButtonLinkProps = LinkProps & BaseButtonProps;

export function ButtonLink({
  variant,
  color,
  iconOnly,
  refProp,
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      {...rest}
      refProp={refProp}
      className={getButtonClassName({
        className,
        color,
        iconOnly,
        variant,
      })}
    />
  );
}
