import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { Form } from "#core/form-elements/form";
import { RequiredStar } from "#core/form-elements/required-star";
import { Textarea } from "#core/form-elements/textarea";
import type { FieldMetadata } from "@conform-to/react";
import { getTextareaProps } from "@conform-to/react";

export function FieldTextarea({
  field,
  label,
  ...props
}: Pick<
  React.ComponentPropsWithoutRef<"textarea">,
  "placeholder" | "required" | "rows"
> & {
  field: FieldMetadata<string>;
  label: React.ReactNode;
}) {
  const textareaProps = getTextareaProps(field);

  return (
    <Form.Field>
      <Form.Label htmlFor={field.id}>
        {label} {field.required || props.required ? <RequiredStar /> : null}
      </Form.Label>

      <Textarea {...textareaProps} {...props} />

      <FieldErrorHelper field={field} />

      {field.errors == null && textareaProps.maxLength != null ? (
        <Form.HelperMessage>
          {field.value?.trim().length ?? 0} / {textareaProps.maxLength}
        </Form.HelperMessage>
      ) : null}
    </Form.Field>
  );
}
