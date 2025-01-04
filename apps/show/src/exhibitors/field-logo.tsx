import { withoutKey } from "#core/conform";
import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { InputFileImage } from "#core/form-elements/input-file-image";
import { FormLayout } from "#core/layout/form-layout";
import type { FieldMetadata } from "@conform-to/react";
import { getInputProps } from "@conform-to/react";

export function FieldLogo({
  field,
  label,
  defaultLogo,
}: {
  field: FieldMetadata<undefined | File>;
  label: React.ReactNode;
  defaultLogo?: React.ComponentPropsWithoutRef<
    typeof InputFileImage.Placeholder
  >["defaultLogo"];
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label htmlFor={field.id}>{label}</FormLayout.Label>

      <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:items-start">
        <InputFileImage.Root>
          <InputFileImage.Input
            key={field.key}
            {...withoutKey(getInputProps(field, { type: "file" }))}
            accept="image/*"
          />

          <InputFileImage.Preview />

          <InputFileImage.Placeholder defaultLogo={defaultLogo} />
        </InputFileImage.Root>

        <FormLayout.Helper asChild>
          <div className="grid grid-cols-1 md:px-1">
            <p>Recommendations pour votre logo :</p>

            <ul className="list-disc pl-[16px]">
              <li>De bonne qualité (≥ 1024 x 768 px)</li>
              <li>Sur fond blanc ou transparent</li>
              <li>Format 4:3</li>
            </ul>
          </div>
        </FormLayout.Helper>
      </div>

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}
