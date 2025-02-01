import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { FileItem } from "#core/data-display/file-item";
import { ARTICLE_COMPONENTS, Markdown } from "#core/data-display/markdown";
import { Form } from "#core/form-elements/form";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import {
  DocumentsStatus,
  DocumentsStatusIcon,
} from "#show/exhibitors/documents/status";
import { StatusHelper } from "#show/exhibitors/status-helper";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardDocuments() {
  const { exhibitor, documents } = useLoaderData<typeof loader>();

  const filesItems = [
    { label: "Pièce d’identité", file: documents.identificationFile },
    { label: "Justificatif d’immatriculation", file: documents.kbisFile },
    { label: "Assurance", file: documents.insuranceFile },
  ];

  return (
    <Card>
      <Card.Header>
        <Card.Title>Documents</Card.Title>

        <Action variant="text" color="gray" asChild>
          <BaseLink
            to={`https://drive.google.com/drive/folders/${documents.folderId}?usp=drive_link`}
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
  const { documents } = useLoaderData<typeof loader>();

  return (
    <StatusHelper.Root>
      <StatusHelper.Header>
        <StatusHelper.Icon asChild>
          <DocumentsStatusIcon status={documents.status} />
        </StatusHelper.Icon>

        <StatusHelper.Title>
          {DocumentsStatus.translation[documents.status]}
        </StatusHelper.Title>
      </StatusHelper.Header>

      {documents.statusMessage != null ? (
        <StatusHelper.Content>
          <Markdown components={ARTICLE_COMPONENTS}>
            {documents.statusMessage}
          </Markdown>
        </StatusHelper.Content>
      ) : null}
    </StatusHelper.Root>
  );
}
