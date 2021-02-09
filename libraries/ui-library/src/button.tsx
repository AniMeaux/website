import cn from "classnames";
import * as React from "react";
import { ChildrenProp, StyleProps } from "./core/types";
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

type ButtonCommonProps = StyleProps & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  color?: ButtonColor;
  iconOnly?: boolean;
  disabled?: boolean;
};

export type ButtonProps = ChildrenProp &
  ButtonCommonProps & {
    type?: "submit" | "reset" | "button";
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      size,
      variant,
      color,
      iconOnly,
      disabled = false,
      className,
      children,
      onClick,
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={getButtonClassName({
          size,
          variant,
          color,
          iconOnly,
          disabled,
          className,
        })}
      >
        {children}
      </button>
    );
  }
);

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
        if (onClick != null && window.confirm(confirmationMessage)) {
          onClick(event);
        }
      }}
    />
  );
}

export type ButtonLinkProps = LinkProps & ButtonCommonProps;

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    { variant, color, iconOnly, className, size, disabled, ...rest },
    ref
  ) {
    return (
      <Link
        {...rest}
        ref={ref}
        disabled={disabled}
        className={getButtonClassName({
          size,
          className,
          color,
          iconOnly,
          variant,
          disabled,
        })}
      />
    );
  }
);

function getButtonClassName({
  size = "medium",
  variant = "secondary",
  color = "default",
  iconOnly = false,
  disabled = false,
  className,
}: ButtonCommonProps) {
  return cn(
    "focus:outline-none focus-visible:ring focus-visible:ring-offset-2 rounded-full flex items-center justify-center",
    ButtonClassName[variant][color].base,
    ButtonSizeClassName[size].base,
    {
      "opacity-50 cursor-auto": disabled,
      "cursor-pointer": !disabled,
    },
    {
      [ButtonSizeClassName[size].iconOnly]: iconOnly,
      "px-4 uppercase tracking-wide font-medium": !iconOnly,
      [ButtonSizeClassName[size].notIconOnly]: !iconOnly,
    },
    className
  );
}
