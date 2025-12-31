import { Markdown, SENTENCE_COMPONENTS } from "#i/core/data-display/markdown";
import { FormLayout } from "#i/core/layout/form-layout";
import { LegalStatus } from "#i/exhibitors/application/legal-status";
import { getCompleteLocation } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionStructure() {
  const { exhibitor, application } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Title>Structure</FormLayout.Title>

      <FormLayout.Field>
        <FormLayout.Label>Nom</FormLayout.Label>

        <FormLayout.Output>{exhibitor.name}</FormLayout.Output>
      </FormLayout.Field>

      <FormLayout.Row>
        <FormLayout.Field>
          <FormLayout.Label>Forme juridique</FormLayout.Label>

          <FormLayout.Output>
            {LegalStatus.getVisibleValue({
              legalStatus: application.structureLegalStatus,
              legalStatusOther: application.structureLegalStatusOther,
            })}
          </FormLayout.Output>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Numéro d’identification</FormLayout.Label>

          <FormLayout.Output>{application.structureSiret}</FormLayout.Output>
        </FormLayout.Field>
      </FormLayout.Row>

      <FormLayout.Field>
        <FormLayout.Label>Adresse de domiciliation</FormLayout.Label>

        <FormLayout.Output>
          <Markdown
            content={getCompleteLocation({
              address: application.structureAddress,
              zipCode: application.structureZipCode,
              city: application.structureCity,
              country: application.structureCountry,
            })}
            components={SENTENCE_COMPONENTS}
          />
        </FormLayout.Output>
      </FormLayout.Field>
    </FormLayout.Section>
  );
}
