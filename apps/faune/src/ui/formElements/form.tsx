import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";

export type FormProps = StyleProps &
  ChildrenProp & {
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
    pending?: boolean;
  };

export function Form({
  onSubmit,
  pending = false,
  className,
  ...rest
}: FormProps) {
  return (
    <form
      {...rest}
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (onSubmit != null && !pending) {
          onSubmit(event);
        }
      }}
      className={cn("Form", className)}
    />
  );
}
