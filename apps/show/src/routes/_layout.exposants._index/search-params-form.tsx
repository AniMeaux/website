import { Form, useSubmit } from "@remix-run/react";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const SearchParamsForm = forwardRef<
  React.ComponentRef<typeof Form>,
  Except<React.ComponentPropsWithoutRef<typeof Form>, "onChange" | "method">
>(function SearchParamsForm(props, ref) {
  const submit = useSubmit();

  return (
    <Form
      ref={ref}
      preventScrollReset
      {...props}
      method="GET"
      onChange={(event) =>
        submit(event.currentTarget, { preventScrollReset: true })
      }
    />
  );
});
