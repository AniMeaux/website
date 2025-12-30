import { FileItem } from "#i/core/data-display/file-item";
import { FieldSwitch } from "#i/core/form-elements/field-switch";
import { FormLayout } from "#i/core/layout/form-layout";
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
            <FileItem.Root asChild>
              <a
                href={file.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="bg-transparent active:bg-mystic-100 can-hover:hover:bg-mystic-50 can-hover:focus-visible:focus-spaced active:can-hover:hover:bg-mystic-100"
              >
                <FileItem.Icon mimeType={file.mimeType} />

                <FileItem.Thumbnail
                  src={file.thumbnailLink}
                  className="transition-transform duration-slow can-hover:group-hover/item:scale-105"
                />

                <FileItem.Filename>{file.name}</FileItem.Filename>
              </a>
            </FileItem.Root>
          </FormLayout.Field>
        ))}
      </FormLayout.RowFluid>

      <FieldSwitch
        label="J’ai lu et j’accepte le règlement ainsi que les tarifs applicables"
        field={fieldset.acceptInnerRegulation}
      />

      <FieldSwitch
        label="Je m’engage à respecter la charte du bien-être animal ainsi que le règlement sanitaire du Salon des Ani’Meaux"
        field={fieldset.acceptCharterAndHealthRegulation}
      />
    </FormLayout.Section>
  );
}
