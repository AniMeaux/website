import { FileItem } from "#core/data-display/file-item";
import { FormLayout } from "#core/layout/form-layout";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionDocuments() {
  const { documents } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Title>Documents</FormLayout.Title>

      <FormLayout.Row>
        <FormLayout.Field>
          <FormLayout.Label>Pièce d’identité</FormLayout.Label>

          <FileItem.Root>
            <FileItem.Icon mimeType={documents.identificationFile?.mimeType} />

            <FileItem.Thumbnail
              src={documents.identificationFile?.thumbnailLink}
            />

            <FileItem.Filename>
              {documents.identificationFile?.originalFilename}
            </FileItem.Filename>
          </FileItem.Root>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Justificatif d’immatriculation</FormLayout.Label>

          <FileItem.Root>
            <FileItem.Icon mimeType={documents.kbisFile?.mimeType} />

            <FileItem.Thumbnail src={documents.kbisFile?.thumbnailLink} />

            <FileItem.Filename>
              {documents.kbisFile?.originalFilename}
            </FileItem.Filename>
          </FileItem.Root>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Assurance</FormLayout.Label>

          <FileItem.Root>
            <FileItem.Icon mimeType={documents.insuranceFile?.mimeType} />

            <FileItem.Thumbnail src={documents.insuranceFile?.thumbnailLink} />

            <FileItem.Filename>
              {documents.insuranceFile?.originalFilename}
            </FileItem.Filename>
          </FileItem.Root>
        </FormLayout.Field>
      </FormLayout.Row>
    </FormLayout.Section>
  );
}
