import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown.js";
import { FormLayout } from "#core/layout/form-layout";
import { getCompleteLocation } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function SectionBillingInfo() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Title>Adresse de facturation</FormLayout.Title>

      <FormLayout.Field>
        <FormLayout.Output>
          <Markdown
            content={getCompleteLocation({
              address: exhibitor.billingAddress,
              zipCode: exhibitor.billingZipCode,
              city: exhibitor.billingCity,
              country: exhibitor.billingCountry,
            })}
            components={SENTENCE_COMPONENTS}
          />
        </FormLayout.Output>
      </FormLayout.Field>
    </FormLayout.Section>
  );
}
