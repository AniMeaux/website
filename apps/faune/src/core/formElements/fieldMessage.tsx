import cn from "classnames";
import { StyleProps } from "core/types";

type FieldMessagePlacement = "top" | "bottom";

const FieldMessagePlacementClassName: {
  [key in FieldMessagePlacement]: string;
} = {
  bottom: "FieldMessage--bottom",
  top: "FieldMessage--top",
};

type FieldMessageProps = StyleProps & {
  placement?: FieldMessagePlacement;
  infoMessage?: React.ReactNode;
  errorMessage?: React.ReactNode;
};

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
          FieldMessagePlacementClassName[placement],
          "FieldMessage FieldMessage--error",
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
          FieldMessagePlacementClassName[placement],
          "FieldMessage",
          className
        )}
      >
        {infoMessage}
      </p>
    );
  }

  return null;
}
