import { FileItem } from "#core/data-display/file-item";
import { Markdown, PARAGRAPH_COMPONENTS } from "#core/data-display/markdown";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { ShowExhibitorDocumentsStatus } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionDocuments() {
  const { documents, token } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Header>
        <FormLayout.Title>Documents</FormLayout.Title>

        {documents.status !== ShowExhibitorDocumentsStatus.VALIDATED ? (
          <FormLayout.HeaderAction asChild>
            <Link
              to={Routes.exhibitors.token(token).documents.edit.toString()}
              title="Modifier"
            >
              <Icon id="pen-light" />
            </Link>
          </FormLayout.HeaderAction>
        ) : null}
      </FormLayout.Header>

      <SectionStatus />

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

function SectionStatus() {
  const { documents } = useLoaderData<typeof loader>();

  if (documents.status === ShowExhibitorDocumentsStatus.TO_BE_FILLED) {
    return null;
  }

  const title = (
    {
      [ShowExhibitorDocumentsStatus.AWAITING_VALIDATION]:
        "En cours de traitement",
      [ShowExhibitorDocumentsStatus.TO_MODIFY]: "À modifier",
      [ShowExhibitorDocumentsStatus.VALIDATED]: "Validé",
    } satisfies Record<typeof documents.status, string>
  )[documents.status];

  const content = (
    {
      [ShowExhibitorDocumentsStatus.AWAITING_VALIDATION]:
        "Votre dossier est en cours de traitement par notre équipe. Pour toute question, vous pouvez nous contacter par e-mail à salon@animeaux.org.",
      [ShowExhibitorDocumentsStatus.TO_MODIFY]:
        documents.statusMessage ??
        "Votre dossier nécessite quelques modifications. Nous vous invitons à les apporter rapidement et à nous contacter par e-mail à salon@animeaux.org pour toute question.",
      [ShowExhibitorDocumentsStatus.VALIDATED]:
        "Votre dossier est complété et validé par notre équipe. Pour toute demande de modification, merci de nous contacter par e-mail à salon@animeaux.org.",
    } satisfies Record<typeof documents.status, string>
  )[documents.status];

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>{title}</HelperCard.Title>

      <div>
        <Markdown content={content} components={PARAGRAPH_COMPONENTS} />
      </div>
    </HelperCard.Root>
  );
}
