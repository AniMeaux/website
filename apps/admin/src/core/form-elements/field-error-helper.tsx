import { Form } from "#core/form-elements/form";
import type { FieldMetadata } from "@conform-to/react";
import type { Except } from "type-fest";

export function FieldErrorHelper({
  field,
  ...props
}: Except<
  React.ComponentPropsWithoutRef<typeof Form.ErrorMessage>,
  "id" | "children"
> & {
  field: FieldMetadata;
}) {
  if (field.errors == null) {
    return null;
  }

  return (
    <Form.ErrorMessage {...props} id={field.errorId}>
      {field.errors.join(". ")}
    </Form.ErrorMessage>
  );
}
