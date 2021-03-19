import cn from "classnames";
import * as React from "react";
import { Button, ButtonProps } from "../actions/button";
import { useIsScrollAtTheBottom } from "../layouts/usePageScroll";

export function SubmitButton({
  type = "submit",
  color = "blue",
  variant = "primary",
  className,
  ...rest
}: ButtonProps) {
  const { isAtTheBottom } = useIsScrollAtTheBottom();

  return (
    <Button
      {...rest}
      type={type}
      color={color}
      variant={variant}
      className={cn(
        "sticky submit-button-bottom mx-4 transition-shadow duration-200 ease-in-out my-8 self-center",
        {
          "shadow-md": !isAtTheBottom,
          "shadow-none": isAtTheBottom,
        },
        className
      )}
    />
  );
}
