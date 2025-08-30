import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown.js";
import { FormLayout } from "#core/layout/form-layout";
import { Routes } from "#core/navigation.js";
import { Icon } from "#generated/icon.js";
import { getCompleteLocation } from "@animeaux/core";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function SectionBillingInfo() {
  const { exhibitor, invoices } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Header>
        <FormLayout.Title>Adresse de facturation</FormLayout.Title>

        {invoices.length === 0 ? (
          <FormLayout.HeaderAction asChild>
            <Link
              to={Routes.exhibitors
                .token(exhibitor.token)
                .invoice.edit.toString()}
              title="Modifier"
            >
              <Icon id="pen-light" />
            </Link>
          </FormLayout.HeaderAction>
        ) : null}
      </FormLayout.Header>

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
