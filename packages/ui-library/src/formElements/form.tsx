import cn from "classnames";
import * as React from "react";

export type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  pending?: boolean;
};

export function Form({
  onSubmit,
  pending = false,
  className,
  ...rest
}: FormProps) {
  const formElement = React.useRef<HTMLFormElement>(null!);

  React.useLayoutEffect(() => {
    if (pending) {
      formElement.current.focus();
    }
  }, [pending]);

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
      className={cn("relative flex flex-col focus:outline-none", className)}
    />
  );
}
