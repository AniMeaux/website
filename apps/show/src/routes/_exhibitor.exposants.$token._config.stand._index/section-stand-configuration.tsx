import {
  Markdown,
  PARAGRAPH_COMPONENTS,
  SENTENCE_COMPONENTS,
} from "#core/data-display/markdown";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { Routes } from "#core/navigation";
import { DIVIDER_TYPE_TRANSLATION } from "#exhibitors/stand-configuration/divider-type";
import { INSTALLATION_DAY_TRANSLATION } from "#exhibitors/stand-configuration/installation-day";
import { STAND_ZONE_TRANSLATION } from "#exhibitors/stand-configuration/stand-zone";
import { Icon } from "#generated/icon";
import { ShowExhibitorStatus } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionStandConfiguration() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Header>
        <FormLayout.Title>Configuration de stand</FormLayout.Title>

        {exhibitor.standConfigurationStatus !==
        ShowExhibitorStatus.VALIDATED ? (
          <FormLayout.HeaderAction asChild>
            <Link
              to={Routes.exhibitors
                .token(exhibitor.token)
                .stand.editStand.toString()}
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
          <FormLayout.Label>Taille du stand</FormLayout.Label>

          <FormLayout.Output>{exhibitor.size.label}</FormLayout.Output>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Raccordement électrique</FormLayout.Label>

          <FormLayout.Output>
            {exhibitor.hasElectricalConnection ? "Oui" : "Non"}
          </FormLayout.Output>
        </FormLayout.Field>
      </FormLayout.Row>

      <FormLayout.Row>
        <FormLayout.Field>
          <FormLayout.Label>Type de cloisons</FormLayout.Label>

          <FormLayout.Output>
            {exhibitor.dividerType != null
              ? DIVIDER_TYPE_TRANSLATION[exhibitor.dividerType]
              : "-"}
          </FormLayout.Output>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Nombre de cloisons</FormLayout.Label>

          <FormLayout.Output>{exhibitor.dividerCount}</FormLayout.Output>
        </FormLayout.Field>
      </FormLayout.Row>

      <FormLayout.Row>
        <FormLayout.Field>
          <FormLayout.Label>Nombre de tables</FormLayout.Label>

          <FormLayout.Output>{exhibitor.tableCount}</FormLayout.Output>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Nappage des tables</FormLayout.Label>

          <FormLayout.Output>
            {exhibitor.hasTablecloths ? "Oui" : "Non"}
          </FormLayout.Output>
        </FormLayout.Field>
      </FormLayout.Row>

      <FormLayout.Row>
        <FormLayout.Field>
          <FormLayout.Label>Nombre de personnes sur le stand</FormLayout.Label>

          <FormLayout.Output>{exhibitor.peopleCount}</FormLayout.Output>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Nombre de chaises</FormLayout.Label>

          <FormLayout.Output>{exhibitor.chairCount}</FormLayout.Output>
        </FormLayout.Field>
      </FormLayout.Row>

      <FormLayout.Field>
        <FormLayout.Label>Jour d’installation</FormLayout.Label>

        <FormLayout.Output>
          {exhibitor.installationDay != null
            ? INSTALLATION_DAY_TRANSLATION[exhibitor.installationDay]
            : "-"}
        </FormLayout.Output>
      </FormLayout.Field>

      <FormLayout.Field>
        <FormLayout.Label>Emplacement</FormLayout.Label>

        <FormLayout.Output>
          {exhibitor.zone == null
            ? "-"
            : STAND_ZONE_TRANSLATION[exhibitor.zone]}
        </FormLayout.Output>
      </FormLayout.Field>

      <FormLayout.Field>
        <FormLayout.Label>
          Commentaire sur votre choix d’emplacement
        </FormLayout.Label>

        <FormLayout.Output>
          {exhibitor.placementComment != null ? (
            <Markdown
              content={exhibitor.placementComment}
              components={SENTENCE_COMPONENTS}
            />
          ) : (
            "-"
          )}
        </FormLayout.Output>
      </FormLayout.Field>
    </FormLayout.Section>
  );
}

function SectionStatus() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (exhibitor.standConfigurationStatus === ShowExhibitorStatus.TO_BE_FILLED) {
    return null;
  }

  const title = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]: "En cours de traitement",
      [ShowExhibitorStatus.TO_MODIFY]: "À modifier",
      [ShowExhibitorStatus.VALIDATED]: "Validée",
    } satisfies Record<typeof exhibitor.standConfigurationStatus, string>
  )[exhibitor.standConfigurationStatus];

  const content = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "La configuration de votre stand est en cours de traitement par notre équipe. Pour toute question, vous pouvez nous contacter par e-mail à salon@animeaux.org.",
      [ShowExhibitorStatus.TO_MODIFY]:
        exhibitor.standConfigurationStatusMessage ??
        "La configuration de votre stand nécessite quelques modifications. Nous vous invitons à les apporter rapidement et à nous contacter par e-mail à salon@animeaux.org pour toute question.",
      [ShowExhibitorStatus.VALIDATED]:
        "La configuration de votre stand est validée par notre équipe et aucune modification n’est plus possible. Pour toute question ou besoin particulier, merci de nous contacter par e-mail à salon@animeaux.org.",
    } satisfies Record<typeof exhibitor.standConfigurationStatus, string>
  )[exhibitor.standConfigurationStatus];

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>{title}</HelperCard.Title>

      <div>
        <Markdown content={content} components={PARAGRAPH_COMPONENTS} />
      </div>
    </HelperCard.Root>
  );
}
