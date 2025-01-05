import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { FormLayout } from "#core/layout/form-layout";
import { DIVIDER_TYPE_TRANSLATION } from "#exhibitors/stand-configuration/divider-type";
import { INSTALLATION_DAY_TRANSLATION } from "#exhibitors/stand-configuration/installation-day";
import { STAND_SIZE_TRANSLATION } from "#exhibitors/stand-size/stand-size";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionStandConfiguration() {
  const { standConfiguration } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Title>Configuration de stand</FormLayout.Title>

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
