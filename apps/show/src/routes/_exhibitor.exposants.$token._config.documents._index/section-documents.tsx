import { FileItem } from "#core/data-display/file-item";
import { Markdown, PARAGRAPH_COMPONENTS } from "#core/data-display/markdown";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { ShowExhibitorStatus } from "@animeaux/prisma";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionDocuments() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Header>
        <FormLayout.Title>Documents</FormLayout.Title>

        {exhibitor.documentStatus !== ShowExhibitorStatus.VALIDATED ? (
          <FormLayout.HeaderAction asChild>
            <Link
              to={Routes.exhibitors
                .token(exhibitor.token)
                .documents.edit.toString()}
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
            <FileItem.Icon mimeType={exhibitor.identificationFile?.mimeType} />

            <FileItem.Thumbnail
              src={exhibitor.identificationFile?.thumbnailLink}
            />

            <FileItem.Filename>
              {exhibitor.identificationFile?.originalFilename}
            </FileItem.Filename>
          </FileItem.Root>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Justificatif d’immatriculation</FormLayout.Label>

          <FileItem.Root>
            <FileItem.Icon mimeType={exhibitor.kbisFile?.mimeType} />

            <FileItem.Thumbnail src={exhibitor.kbisFile?.thumbnailLink} />

            <FileItem.Filename>
              {exhibitor.kbisFile?.originalFilename}
            </FileItem.Filename>
          </FileItem.Root>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Assurance</FormLayout.Label>

          <FileItem.Root>
            <FileItem.Icon mimeType={exhibitor.insuranceFile?.mimeType} />

            <FileItem.Thumbnail src={exhibitor.insuranceFile?.thumbnailLink} />

            <FileItem.Filename>
              {exhibitor.insuranceFile?.originalFilename}
            </FileItem.Filename>
          </FileItem.Root>
        </FormLayout.Field>
      </FormLayout.Row>
    </FormLayout.Section>
  );
}

function SectionStatus() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (exhibitor.documentStatus === ShowExhibitorStatus.TO_BE_FILLED) {
    return null;
  }

  const title = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]: "En cours de traitement",
      [ShowExhibitorStatus.TO_MODIFY]: "À modifier",
      [ShowExhibitorStatus.VALIDATED]: "Validé",
    } satisfies Record<typeof exhibitor.documentStatus, string>
  )[exhibitor.documentStatus];

  const content = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "Votre dossier est en cours de traitement par notre équipe. Pour toute question, vous pouvez nous contacter par e-mail à salon@animeaux.org.",
      [ShowExhibitorStatus.TO_MODIFY]:
        exhibitor.documentStatusMessage ??
        "Votre dossier nécessite quelques modifications. Nous vous invitons à les apporter rapidement et à nous contacter par e-mail à salon@animeaux.org pour toute question.",
      [ShowExhibitorStatus.VALIDATED]:
        "Votre dossier est complété et validé par notre équipe. Pour toute demande de modification, merci de nous contacter par e-mail à salon@animeaux.org.",
    } satisfies Record<typeof exhibitor.documentStatus, string>
  )[exhibitor.documentStatus];

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>{title}</HelperCard.Title>

      <div>
        <Markdown content={content} components={PARAGRAPH_COMPONENTS} />
      </div>
    </HelperCard.Root>
  );
}
