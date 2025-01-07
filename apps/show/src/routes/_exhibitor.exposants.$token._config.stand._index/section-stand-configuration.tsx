import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { Routes } from "#core/navigation";
import { DIVIDER_TYPE_TRANSLATION } from "#exhibitors/stand-configuration/divider-type";
import { INSTALLATION_DAY_TRANSLATION } from "#exhibitors/stand-configuration/installation-day";
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

  switch (standConfiguration.status) {
    case ShowExhibitorStandConfigurationStatus.AWAITING_VALIDATION: {
      return (
        <HelperCard.Root color="paleBlue">
          <HelperCard.Title>En cours de traitement</HelperCard.Title>

          <p>
            La configuration de votre stand est en cours de validation par notre
            équipe. Pour toute question, vous pouvez nous contacter par e-mail à{" "}
            <ProseInlineAction asChild>
              <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
            </ProseInlineAction>
            .
          </p>
        </HelperCard.Root>
      );
    }

    case ShowExhibitorStandConfigurationStatus.TO_BE_FILLED: {
      return null;
    }

    case ShowExhibitorStandConfigurationStatus.TO_MODIFY: {
      return (
        <HelperCard.Root color="paleBlue">
          <HelperCard.Title>À modifier</HelperCard.Title>

          <p>
            {standConfiguration.statusMessage == null ? (
              <>
                La configuration de votre stand nécessite quelques
                modifications. Nous vous invitons à les apporter rapidement et à
                nous contacter par e-mail à{" "}
                <ProseInlineAction asChild>
                  <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
                </ProseInlineAction>{" "}
                pour toute question.
              </>
            ) : (
              <Markdown
                content={standConfiguration.statusMessage}
                components={SENTENCE_COMPONENTS}
              />
            )}
          </p>
        </HelperCard.Root>
      );
    }

    case ShowExhibitorStandConfigurationStatus.VALIDATED: {
      return (
        <HelperCard.Root color="paleBlue">
          <HelperCard.Title>Validée</HelperCard.Title>

          <p>
            La configuration de votre stand est validée et aucune modification
            n’est plus possible. Pour toute question ou besoin particulier,
            merci de nous contacter par e-mail à{" "}
            <ProseInlineAction asChild>
              <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
            </ProseInlineAction>
            .
          </p>
        </HelperCard.Root>
      );
    }

    default: {
      return standConfiguration.status satisfies never;
    }
  }
}
