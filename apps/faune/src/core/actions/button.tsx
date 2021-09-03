import cn from "classnames";
import { Link, LinkProps } from "core/link";
import { ChildrenProp, StyleProps } from "core/types";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outlined";

const ButtonVariantClassName: {
  [key in ButtonVariant]: string;
} = {
  primary: "Button--primary",
  secondary: "Button--secondary",
  outlined: "Button--outlined",
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
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
