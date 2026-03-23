import { getCompleteLocation } from "@animeaux/core"
import { useLoaderData } from "@remix-run/react"

import { Action } from "#i/core/actions.js"
import { BaseLink } from "#i/core/base-link.js"
import { ItemList, SimpleItem } from "#i/core/data-display/item.js"
import { Markdown, SENTENCE_COMPONENTS } from "#i/core/data-display/markdown.js"
import { Card } from "#i/core/layout/card.js"
import { Routes } from "#i/core/navigation.js"
import { Icon } from "#i/generated/icon.js"
import { LegalStatus } from "#i/show/exhibitors/applications/legal-status.js"

import type { loader } from "./loader.server.js"

export function CardStructure() {
  const { exhibitor } = useLoaderData<typeof loader>()

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
  )
}

function ItemAddress() {
  const { application } = useLoaderData<typeof loader>()

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
  )
}

function ItemLegalStatus() {
  const { application } = useLoaderData<typeof loader>()

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-fingerprint-light" />}>
      {LegalStatus.getVisibleValue({
        legalStatus: application.structureLegalStatus,
        legalStatusOther: application.structureLegalStatusOther,
      })}{" "}
      • {application.structureSiret}
    </SimpleItem>
  )
}

function ItemName() {
  const { exhibitor } = useLoaderData<typeof loader>()

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-house-building-light" />}>
      {exhibitor.name}
    </SimpleItem>
  )
}
