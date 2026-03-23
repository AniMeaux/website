import type { FieldMetadata } from "@conform-to/react"
import { getInputProps } from "@conform-to/react"

import { FieldErrorHelper } from "#i/core/form-elements/field-error-helper.js"
import { FormLayout } from "#i/core/layout/form-layout.js"

export function FieldNumeric({
  field,
  label,
}: {
  field: FieldMetadata<string>
  label: React.ReactNode
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label htmlFor={field.id}>{label}</FormLayout.Label>

      <FormLayout.Input
        {...getInputProps(field, { type: "text" })}
        inputMode="numeric"
      />

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  )
}
