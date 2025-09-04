import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { InputStepper } from "#core/form-elements/input-stepper";
import { FormLayout } from "#core/layout/form-layout";
import { toBooleanAttribute } from "@animeaux/core";
import type { FieldMetadata } from "@conform-to/react";
import { useInputControl } from "@conform-to/react";

export function FieldStepper({
  field,
  label,
  minValue = 0,
  maxValue,
  helper,
}: {
  field: FieldMetadata<number>;
  label: React.ReactNode;
  minValue?: number;
  maxValue?: number;
  helper?: React.ReactNode;
}) {
  const fieldControl = useInputControl(field);

  return (
    <FormLayout.Field>
      <FormLayout.Label htmlFor={field.id}>{label}</FormLayout.Label>

      <InputStepper
        key={field.key}
        id={field.id}
        value={fieldControl.value ?? ""}
        onChange={fieldControl.change}
        min={minValue}
        max={maxValue}
        onFocus={fieldControl.focus}
        onBlur={fieldControl.blur}
        // Don't use `getInputProps` as we don't want some props.
        // https://conform.guide/api/react/getInputProps#tips
        aria-invalid={toBooleanAttribute(!field.valid)}
        aria-describedby={!field.valid ? field.errorId : undefined}
        required={field.required}
        minLength={field.minLength}
        maxLength={field.maxLength}
        step={field.step}
        pattern={field.pattern}
        multiple={field.multiple}
      />

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </FormLayout.Field>
  );
}
