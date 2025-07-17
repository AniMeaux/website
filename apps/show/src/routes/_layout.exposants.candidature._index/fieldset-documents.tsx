import { FileItem } from "#core/data-display/file-item";
import { FieldSwitch } from "#core/form-elements/field-switch";
import { FormLayout } from "#core/layout/form-layout";
import { useLoaderData } from "@remix-run/react";
import { FieldsetId, useFieldsets } from "./form";
import type { loader } from "./loader.server";

export function FieldsetDocuments() {
  const { files } = useLoaderData<typeof loader>();
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.documents.getFieldset();

  return (
    <FormLayout.Section id={FieldsetId.DOCUMENTS}>
      <FormLayout.Title>Documents</FormLayout.Title>

      <FormLayout.RowFluid columnMinWidth="150px">
        {files.map((file) => (
          <FormLayout.Field key={file.id}>
            <FileItem.Root>
              <FileItem.Icon mimeType={file.mimeType} />

              <FileItem.Thumbnail src={file.thumbnailLink} />

              <FileItem.Filename>{file.name}</FileItem.Filename>
            </FileItem.Root>
          </FormLayout.Field>
        ))}
      </FormLayout.RowFluid>

      <FieldSwitch
        label="J’ai lu et j’accepte le règlement ainsi que les tarifs applicables"
        field={fieldset.acceptInnerRegulation}
      />
    </FormLayout.Section>
  );
}
