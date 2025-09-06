import { FileItem } from "#core/data-display/file-item";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function SectionDocuments() {
  return (
    <FormLayout.Section>
      <FormLayout.Title>Documents</FormLayout.Title>

      <Helper />
      <Files />
    </FormLayout.Section>
  );
}

function Helper() {
  return (
    <HelperCard.Root color="alabaster">
      <p>
        Retrouvez ici tous les documents essentiels pour préparer et organiser
        votre participation au salon dans les meilleures conditions.
      </p>
    </HelperCard.Root>
  );
}

function Files() {
  const { files } = useLoaderData<typeof loader>();

  return (
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
  );
}
