import { useLoaderData } from "@remix-run/react"

import { FileItem } from "#i/core/data-display/file-item.js"
import { FormLayout } from "#i/core/layout/form-layout.js"
import { HelperCard } from "#i/core/layout/helper-card.js"

import type { loader } from "./loader.server.js"

export function SectionDocuments() {
  return (
    <FormLayout.Section>
      <FormLayout.Title>Documents</FormLayout.Title>

      <Helper />
      <Files />
    </FormLayout.Section>
  )
}

function Helper() {
  return (
    <HelperCard.Root color="alabaster">
      <p>
        Retrouvez ici tous les documents essentiels pour préparer et organiser
        votre participation au salon dans les meilleures conditions.
      </p>
    </HelperCard.Root>
  )
}

function Files() {
  const { files } = useLoaderData<typeof loader>()

  return (
    <FormLayout.RowFluid columnMinWidth="150px">
      {files.map((file) => (
        <FormLayout.Field key={file.id}>
          <FileItem.Root asChild>
            <a
              href={file.webViewLink}
              target="_blank"
              rel="noreferrer"
              className="bg-transparent focus-ring-spaced hover:bg-mystic-50 focus-visible:focus-ring active:bg-mystic-100 active:hover:bg-mystic-100"
            >
              <FileItem.Icon mimeType={file.mimeType} />

              <FileItem.Thumbnail
                src={file.thumbnailLink}
                className="transition-transform duration-slow group-hover/item:scale-105"
              />

              <FileItem.Filename>{file.name}</FileItem.Filename>
            </a>
          </FileItem.Root>
        </FormLayout.Field>
      ))}
    </FormLayout.RowFluid>
  )
}
