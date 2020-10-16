import cn from "classnames";
import * as React from "react";

type ButtonVariant = "secondary" | "primary";
type ButtonColor = "default" | "blue" | "red";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  color?: ButtonColor;
};

const ButtonStyles: {
  [key in ButtonVariant]: {
    [key in ButtonColor]: string;
  };
} = {
  secondary: {
    default: "",
    blue: "bg-blue-50 text-blue-500",
    red: "bg-red-50 text-red-500",
  },
  primary: {
    default: "",
    blue: "bg-blue-500 text-white",
    red: "",
  },
};

export function Button({
  variant = "secondary",
  color = "default",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "a11y-focus h-10 disabled:opacity-75 rounded-md px-4 text-sm uppercase tracking-wide font-medium",
        ButtonStyles[variant][color],
        className
      )}
    />
  );
}
