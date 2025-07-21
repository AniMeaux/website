import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { LegalStatus } from "#show/exhibitors/applications/legal-status";
import { getCompleteLocation } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardStructure() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Structure</Card.Title>

        <Action variant="text" asChild>
          <BaseLink
            to={Routes.show.exhibitors
              .id(exhibitor.id)
              .edit.structure.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <ItemName />
          <ItemAddress />
          <ItemLegalStatus />
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function ItemAddress() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-location-dot-light" />}>
      <Markdown components={SENTENCE_COMPONENTS}>
        {getCompleteLocation({
          address: application.structureAddress,
          zipCode: application.structureZipCode,
          city: application.structureCity,
          country: application.structureCountry,
        })}
      </Markdown>
    </SimpleItem>
  );
}

function ItemLegalStatus() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-fingerprint-light" />}>
      {LegalStatus.getVisibleLegalStatus({
        legalStatus: application.structureLegalStatus,
        otherLegalStatus: application.structureOtherLegalStatus,
      })}{" "}
      • {application.structureSiret}
    </SimpleItem>
  );
}

function ItemName() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-house-building-light" />}>
      {exhibitor.name}
    </SimpleItem>
  );
}
