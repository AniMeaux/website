import cn from "classnames";
import * as React from "react";
import { ChildrenProp, Link, LinkProps, StyleProps } from "../core";

type ButtonVariant = "primary" | "outlined";

const ButtonVariantClassName: {
  [key in ButtonVariant]: string;
} = {
  outlined: "Button--outlined",
  primary: "Button--primary",
};

type ButtonSize = "small" | "medium";

const ButtonSizeClassName: {
  [key in ButtonSize]: string;
} = {
  small: "Button--small",
  medium: "Button--medium",
};

type ButtonCommonProps = StyleProps & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  iconOnly?: boolean;
  disabled?: boolean;
  title?: string;
};

export type ButtonProps = ChildrenProp &
  ButtonCommonProps & {
    type?: "submit" | "reset" | "button";
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "outlined",
      size = "medium",
      iconOnly = false,
      disabled = false,
      className,
      ...rest
    },
    ref
  ) {
    return (
      <button
        {...rest}
        ref={ref}
        disabled={disabled}
        className={cn(
          "Button",
          ButtonSizeClassName[size],
          ButtonVariantClassName[variant],
          {
            "Button--isIconOnly": iconOnly,
            "Button--disabled": disabled,
          },
          className
        )}
      />
    );
  }
);

export type ButtonLinkProps = LinkProps & ButtonCommonProps;

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    {
      variant = "outlined",
      size = "medium",
      iconOnly = false,
      disabled = false,
      className,
      ...rest
    },
    ref
  ) {
    return (
      <Link
        {...rest}
        ref={ref}
        disabled={disabled}
        className={cn(
          "Button",
          ButtonSizeClassName[size],
          ButtonVariantClassName[variant],
          {
            "Button--isIconOnly": iconOnly,
            "Button--disabled": disabled,
          },
          className
        )}
      />
    );
  }
);
