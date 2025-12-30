import { FieldErrorHelper } from "#i/core/form-elements/field-error-helper";
import { InputFile } from "#i/core/form-elements/input-file";
import { FormLayout } from "#i/core/layout/form-layout";
import type { FileStorage } from "@animeaux/file-storage/server";
import type { FieldMetadata } from "@conform-to/react";
import { getInputProps } from "@conform-to/react";

export function FieldFile({
  field,
  label,
  currentIdField,
  defaultFile,
  helper,
}: {
  field: FieldMetadata<undefined | File>;
  label: React.ReactNode;
  currentIdField: FieldMetadata<string>;
  defaultFile?: null | FileStorage.File;
  helper?: React.ReactNode;
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label htmlFor={field.id}>{label}</FormLayout.Label>

      <input {...getInputProps(currentIdField, { type: "hidden" })} />

      <InputFile.Root>
        <InputFile.Input
          {...getInputProps(field, { type: "file" })}
          accept="image/*,.pdf"
        />

        <InputFile.Icon />
        <InputFile.Thumbnail src={defaultFile?.thumbnailLink} />
        <InputFile.Filename>{defaultFile?.originalFilename}</InputFile.Filename>
      </InputFile.Root>

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </FormLayout.Field>
  );
}
