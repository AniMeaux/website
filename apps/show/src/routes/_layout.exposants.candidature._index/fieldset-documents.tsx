import { FileItem } from "#core/data-display/file-item";
import { FormLayout } from "#core/layout/form-layout";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function FieldsetDocuments() {
  const { files } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
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
    </FormLayout.Section>
  );
}
