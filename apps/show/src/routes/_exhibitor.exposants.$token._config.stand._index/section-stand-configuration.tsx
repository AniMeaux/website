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
import { STAND_SIZE_TRANSLATION } from "#exhibitors/stand-size/stand-size";
import { Icon } from "#generated/icon";
import { ShowExhibitorStandConfigurationStatus } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionStandConfiguration() {
  const { standConfiguration, token } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Header>
        <FormLayout.Title>Configuration de stand</FormLayout.Title>

        {standConfiguration.status !==
        ShowExhibitorStandConfigurationStatus.VALIDATED ? (
          <FormLayout.HeaderAction asChild>
            <Link
              to={Routes.exhibitors.token(token).stand.editStand.toString()}
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

          <FormLayout.Output>
            {STAND_SIZE_TRANSLATION[standConfiguration.size]}
          </FormLayout.Output>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Raccordement électrique</FormLayout.Label>

          <FormLayout.Output>
            {standConfiguration.hasElectricalConnection ? "Oui" : "Non"}
          </FormLayout.Output>
        </FormLayout.Field>
      </FormLayout.Row>

      <FormLayout.Row>
        <FormLayout.Field>
          <FormLayout.Label>Type de cloisons</FormLayout.Label>

          <FormLayout.Output>
            {standConfiguration.dividerType != null
              ? DIVIDER_TYPE_TRANSLATION[standConfiguration.dividerType]
              : "-"}
          </FormLayout.Output>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Nombre de cloisons</FormLayout.Label>

          <FormLayout.Output>
            {standConfiguration.dividerCount}
          </FormLayout.Output>
        </FormLayout.Field>
      </FormLayout.Row>

      <FormLayout.Row>
        <FormLayout.Field>
          <FormLayout.Label>Nombre de tables</FormLayout.Label>

          <FormLayout.Output>{standConfiguration.tableCount}</FormLayout.Output>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Nappage des tables</FormLayout.Label>

          <FormLayout.Output>
            {standConfiguration.hasTablecloths ? "Oui" : "Non"}
          </FormLayout.Output>
        </FormLayout.Field>
      </FormLayout.Row>

      <FormLayout.Row>
        <FormLayout.Field>
          <FormLayout.Label>Nombre de personnes sur le stand</FormLayout.Label>

          <FormLayout.Output>
            {standConfiguration.peopleCount}
          </FormLayout.Output>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Nombre de chaises</FormLayout.Label>

          <FormLayout.Output>{standConfiguration.chairCount}</FormLayout.Output>
        </FormLayout.Field>
      </FormLayout.Row>

      <FormLayout.Field>
        <FormLayout.Label>Jour d’installation</FormLayout.Label>

        <FormLayout.Output>
          {standConfiguration.installationDay != null
            ? INSTALLATION_DAY_TRANSLATION[standConfiguration.installationDay]
            : "-"}
        </FormLayout.Output>
      </FormLayout.Field>

      <FormLayout.Field>
        <FormLayout.Label>Emplacement</FormLayout.Label>

        <FormLayout.Output>
          {standConfiguration.zone == null
            ? "-"
            : STAND_ZONE_TRANSLATION[standConfiguration.zone]}
        </FormLayout.Output>
      </FormLayout.Field>

      <FormLayout.Field>
        <FormLayout.Label>
          Commentaire sur votre choix d’emplacement
        </FormLayout.Label>

        <FormLayout.Output>
          {standConfiguration.placementComment != null ? (
            <Markdown
              content={standConfiguration.placementComment}
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
  const { standConfiguration } = useLoaderData<typeof loader>();

  if (
    standConfiguration.status ===
    ShowExhibitorStandConfigurationStatus.TO_BE_FILLED
  ) {
    return null;
  }

  const title = (
    {
      [ShowExhibitorStandConfigurationStatus.AWAITING_VALIDATION]:
        "En cours de traitement",
      [ShowExhibitorStandConfigurationStatus.TO_MODIFY]: "À modifier",
      [ShowExhibitorStandConfigurationStatus.VALIDATED]: "Validée",
    } satisfies Record<typeof standConfiguration.status, string>
  )[standConfiguration.status];

  const content = (
    {
      [ShowExhibitorStandConfigurationStatus.AWAITING_VALIDATION]:
        "La configuration de votre stand est en cours de traitement par notre équipe. Pour toute question, vous pouvez nous contacter par e-mail à salon@animeaux.org.",
      [ShowExhibitorStandConfigurationStatus.TO_MODIFY]:
        standConfiguration.statusMessage ??
        "La configuration de votre stand nécessite quelques modifications. Nous vous invitons à les apporter rapidement et à nous contacter par e-mail à salon@animeaux.org pour toute question.",
      [ShowExhibitorStandConfigurationStatus.VALIDATED]:
        "La configuration de votre stand est validée par notre équipe et aucune modification n’est plus possible. Pour toute question ou besoin particulier, merci de nous contacter par e-mail à salon@animeaux.org.",
    } satisfies Record<typeof standConfiguration.status, string>
  )[standConfiguration.status];

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>{title}</HelperCard.Title>

      <div>
        <Markdown content={content} components={PARAGRAPH_COMPONENTS} />
      </div>
    </HelperCard.Root>
  );
}
