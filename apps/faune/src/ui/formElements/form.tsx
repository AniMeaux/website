import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";
import { useLayoutEffect, useRef } from "react";

export type FormProps = StyleProps &
  ChildrenProp & {
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
    pending?: boolean;
  };

export function Form({
  onSubmit,
  pending = false,
  className,
  children,
}: FormProps) {
  const formElement = useRef<HTMLFormElement>(null!);

  useLayoutEffect(() => {
    if (pending) {
      formElement.current.focus();
    }
  }, [pending]);

  return (
    <form
      ref={formElement}
      tabIndex={-1}
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (onSubmit != null) {
          onSubmit(event);
        }
      }}
      className={cn("Form", className)}
    >
      {children}
    </form>
  );
}
