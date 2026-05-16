import { useLoaderData } from "@remix-run/react"

import { BaseLink } from "#i/core/base-link.js"
import { FileItem } from "#i/core/data-display/file-item.js"
import { Form } from "#i/core/form-elements/form.js"
import { Card } from "#i/core/layout/card.js"

import type { loader } from "./route.js"

export function FieldsetDocuments() {
  const { exhibitor } = useLoaderData<typeof loader>()

  const filesItems = [
    { label: "Pièce d’identité", file: exhibitor.identificationFile },
    { label: "Justificatif d’immatriculation", file: exhibitor.kbisFile },
    { label: "Assurance", file: exhibitor.insuranceFile },
  ]

  return (
    <Card>
      <Card.Header>
        <Card.Title>Documents</Card.Title>
      </Card.Header>

      <Card.Content>
        <div className="grid grid-cols-auto-fill-[150px] gap-1 md:gap-2">
          {filesItems.map((fileItem) => (
            <Form.Field key={fileItem.label}>
              <Form.Label>{fileItem.label}</Form.Label>

              <FileItem.Root asChild>
                <BaseLink
                  to={fileItem.file?.webViewLink}
                  shouldOpenInNewTarget
                  className="focus-visible:focus-ring"
                >
                  <FileItem.Icon mimeType={fileItem.file?.mimeType} />

                  <FileItem.Thumbnail
                    src={fileItem.file?.thumbnailLink}
                    className="transition-transform duration-slow group-hover/item:scale-105"
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
  )
}
