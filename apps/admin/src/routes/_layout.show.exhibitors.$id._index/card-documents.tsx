import { Action } from "#i/core/actions";
import { BaseLink } from "#i/core/base-link";
import { FileItem } from "#i/core/data-display/file-item";
import { ARTICLE_COMPONENTS, Markdown } from "#i/core/data-display/markdown";
import { Form } from "#i/core/form-elements/form";
import { Card } from "#i/core/layout/card";
import { Routes } from "#i/core/navigation";
import { ExhibitorStatus } from "#i/show/exhibitors/status";
import { StatusHelper } from "#i/show/exhibitors/status-helper";
import { ExhibitorStatusIcon } from "#i/show/exhibitors/status-icon.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardDocuments() {
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

        <Action variant="text" color="gray" asChild>
          <BaseLink
            to={`https://drive.google.com/drive/folders/${exhibitor.folderId}?usp=drive_link`}
            shouldOpenInNewTarget
          >
            <Action.Icon href="icon-google-drive-solid" />
            Dossier Drive
          </BaseLink>
        </Action>

        <Action variant="text" asChild>
          <BaseLink
            to={Routes.show.exhibitors
              .id(exhibitor.id)
              .edit.documents.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <DocumentsStatusHelper />

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

function DocumentsStatusHelper() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <StatusHelper.Root>
      <StatusHelper.Header>
        <StatusHelper.Icon asChild>
          <ExhibitorStatusIcon status={exhibitor.documentStatus} />
        </StatusHelper.Icon>

        <StatusHelper.Title>
          {ExhibitorStatus.translation[exhibitor.documentStatus]}
        </StatusHelper.Title>
      </StatusHelper.Header>

      {exhibitor.documentStatusMessage != null ? (
        <StatusHelper.Content>
          <Markdown components={ARTICLE_COMPONENTS}>
            {exhibitor.documentStatusMessage}
          </Markdown>
        </StatusHelper.Content>
      ) : null}
    </StatusHelper.Root>
  );
}
