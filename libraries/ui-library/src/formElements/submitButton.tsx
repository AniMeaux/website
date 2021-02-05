import cn from "classnames";
import * as React from "react";
import { Button, ButtonProps } from "../button";

export function SubmitButton({ className, ...rest }: ButtonProps) {
  return (
    <Button
      // Allow override
      type="submit"
      variant="primary"
      color="blue"
      {...rest}
      className={cn("m-4 mb-8", className)}
    />
  );
}
