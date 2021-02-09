import cn from "classnames";
import * as React from "react";
import { Button, ButtonProps } from "../button";

export function SubmitButton({
  type = "submit",
  color = "blue",
  variant = "primary",
  className,
  ...rest
}: ButtonProps) {
  return (
    <Button
      {...rest}
      type={type}
      color={color}
      variant={variant}
      className={cn("m-4 mb-8", className)}
    />
  );
}
