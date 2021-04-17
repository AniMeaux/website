import cn from "classnames";
import * as React from "react";
import { Button, ButtonProps } from "../actions/button";
import { useIsScrollAtTheBottom } from "../layouts/usePageScroll";

export function SubmitButton({
  type = "submit",
  variant = "primary",
  className,
  ...rest
}: ButtonProps) {
  const { isAtTheBottom } = useIsScrollAtTheBottom();

  return (
    <Button
      {...rest}
      type={type}
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
