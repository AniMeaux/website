import cn from "classnames";
import * as React from "react";
import { FormFog } from "./formFog";

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  pending?: boolean;
};

export function Form({
  onSubmit,
  pending,
  children,
  className,
  ...rest
}: FormProps) {
  const formElement = React.useRef<HTMLFormElement>(null!);
  const disabled = pending;

  React.useLayoutEffect(() => {
    if (disabled) {
      formElement.current.focus();
    }
  }, [disabled]);

  return (
    <form
      {...rest}
      ref={formElement}
      tabIndex={-1}
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (onSubmit != null) {
          onSubmit(event);
        }
      }}
      className={cn(
        "relative py-8 px-4 flex flex-col focus:outline-none",
        className
      )}
    >
      {children}
      {pending && <FormFog />}
    </form>
  );
}
