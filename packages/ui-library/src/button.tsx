import cn from "classnames";
import * as React from "react";
import { Link, LinkProps } from "./link";

type ButtonVariant = "secondary" | "primary" | "outlined";
type ButtonColor = "default" | "blue" | "red";

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
  outlined: {
    default: {
      base: "bg-black bg-opacity-0 border",
      enabled: "md:hover:bg-opacity-4",
    },
    blue: {
      base: "",
      enabled: "",
    },
    red: {
      base: "",
      enabled: "",
    },
  },
};

type ButtonPropsForClassName = {
  variant?: ButtonVariant;
  color?: ButtonColor;
  iconOnly?: boolean;
  disabled?: boolean;
  className?: string;
};

function getButtonClassName({
  variant = "secondary",
  color = "default",
  iconOnly = false,
  disabled = false,
  className,
}: ButtonPropsForClassName) {
  return cn(
    "a11y-focus disabled:opacity-75 disabled:cursor-auto h-10 flex items-center justify-center",
    ButtonClassName[variant][color].base,
    {
      [ButtonClassName[variant][color].enabled]: !disabled,
      "w-10 rounded-full": iconOnly,
      "rounded-md px-4 min-w-button text-sm uppercase tracking-wide font-medium": !iconOnly,
    },
    className
  );
}

type BaseButtonProps = {
  variant?: ButtonVariant;
  color?: ButtonColor;
  iconOnly?: boolean;
  refProp?: React.RefObject<HTMLButtonElement>;
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  BaseButtonProps;

export function Button({
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
        className,
        color,
        disabled,
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
        disabled: false,
        iconOnly,
        variant,
      })}
    />
  );
}
