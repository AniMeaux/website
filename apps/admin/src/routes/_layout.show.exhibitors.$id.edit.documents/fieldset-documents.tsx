import { BaseLink } from "#i/core/base-link";
import { FileItem } from "#i/core/data-display/file-item";
import { Form } from "#i/core/form-elements/form";
import { Card } from "#i/core/layout/card";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function FieldsetDocuments() {
  const { exhibitor } = useLoaderData<typeof loader>();

  const filesItems = [
    { label: "Pièce d’identité", file: exhibitor.identificationFile },
    { label: "Justificatif d’immatriculation", file: exhibitor.kbisFile },
    { label: "Assurance", file: exhibitor.insuranceFile },
  ];

  return (
    <Card>
      <Card.Header>
        <Card.Title>Documents</Card.Title>
      </Card.Header>

      <Card.Content>
        <div className="grid gap-1 grid-auto-fill-cols-[150px] md:gap-2">
          {filesItems.map((fileItem) => (
            <Form.Field key={fileItem.label}>
              <Form.Label>{fileItem.label}</Form.Label>

              <FileItem.Root asChild>
                <BaseLink
                  to={fileItem.file?.webViewLink}
                  shouldOpenInNewTarget
                  className="focus-visible:focus-compact-blue-400"
                >
                  <FileItem.Icon mimeType={fileItem.file?.mimeType} />

                  <FileItem.Thumbnail
                    src={fileItem.file?.thumbnailLink}
                    className="transition-transform duration-150 can-hover:group-hover/item:scale-105"
                  />

                  <FileItem.Filename>
                    {fileItem.file?.originalFilename}
                  </FileItem.Filename>
                </BaseLink>
              </FileItem.Root>
            </Form.Field>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
