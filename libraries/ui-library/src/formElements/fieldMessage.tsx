import cn from "classnames";
import * as React from "react";
import { StyleProps } from "../core";

type FieldMessagePlacement = "top" | "bottom";

const FieldMessagePlacementClassName: {
  [key in FieldMessagePlacement]: string;
} = {
  bottom: "mt-1",
  top: "mb-1",
};

type FieldMessageProps = StyleProps & {
  placement?: FieldMessagePlacement;
  infoMessage?: React.ReactNode;
  errorMessage?: React.ReactNode;
};

const COMMON_CLASS_NAME = "px-4 text-xs";

export function FieldMessage({
  placement = "bottom",
  infoMessage,
  errorMessage,
  className,
}: FieldMessageProps) {
  if (errorMessage != null) {
    return (
      <p
        className={cn(
          COMMON_CLASS_NAME,
          FieldMessagePlacementClassName[placement],
          "text-red-500",
          className
        )}
      >
        {errorMessage}
      </p>
    );
  }

  if (infoMessage != null) {
    return (
      <p
        className={cn(
          COMMON_CLASS_NAME,
          FieldMessagePlacementClassName[placement],
          "text-black text-opacity-60",
          className
        )}
      >
        {infoMessage}
      </p>
    );
  }

  return null;
}
