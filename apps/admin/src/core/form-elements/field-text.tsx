import type { FieldMetadata } from "@conform-to/react"
import { getInputProps } from "@conform-to/react"

import { FieldErrorHelper } from "#i/core/form-elements/field-error-helper.js"
import { Form } from "#i/core/form-elements/form.js"
import { Input } from "#i/core/form-elements/input.js"
import { RequiredStar } from "#i/core/form-elements/required-star.js"

export function FieldText({
  field,
  label,
  helper,
  ...props
}: Pick<
  React.ComponentPropsWithoutRef<"input">,
  "inputMode" | "pattern" | "placeholder" | "required"
> & {
  field: FieldMetadata<string | number>
  label: React.ReactNode
  helper?: React.ReactNode
  leftAdornment?: React.ComponentProps<typeof Input>["leftAdornment"]
}) {
  return (
    <Form.Field>
      <Form.Label htmlFor={field.id}>
        {label} {field.required || props.required ? <RequiredStar /> : null}
      </Form.Label>

      <Input {...getInputProps(field, { type: "text" })} {...props} />

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </Form.Field>
  )
}
