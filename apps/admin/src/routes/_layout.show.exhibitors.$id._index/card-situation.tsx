import { joinReactNodes } from "@animeaux/core"
import { useLoaderData } from "@remix-run/react"
import { Fragment } from "react/jsx-runtime"

import { Action, ProseInlineAction } from "#i/core/actions.js"
import { BaseLink } from "#i/core/base-link.js"
import { ItemList, SimpleItem } from "#i/core/data-display/item.js"
import { Card } from "#i/core/layout/card.js"
import { Routes } from "#i/core/navigation.js"
import { Icon } from "#i/generated/icon.js"
import {
  ApplicationStatusIcon,
  TRANSLATION_BY_APPLICATION_STATUS,
} from "#i/show/exhibitors/applications/status.js"
import { InvoiceIcon } from "#i/show/invoice/icon.js"
import { InvoiceStatus } from "#i/show/invoice/status.js"
import { SponsorshipCategory } from "#i/show/sponsors/category.js"
import { Visibility, VisibilityIcon } from "#i/show/visibility.js"

import type { loader } from "./loader.server.js"

export function CardSituation() {
  const { exhibitor } = useLoaderData<typeof loader>()

  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>

        <Action variant="text" asChild>
          <BaseLink
            to={Routes.show.exhibitors
              .id(exhibitor.id)
              .edit.situation.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <ItemVisibility />
          <ItemInvoiceStatus />
          <ItemLocationNumber />
          <ItemApplication />
          <ItemOrganizer />
          <ItemSponsorship />
          <ItemOrganizersFavorite />
          <ItemRisingStar />
          <ItemExhibitorSpace />
        </ItemList>
      </Card.Content>
    </Card>
  )
}

function ItemApplication() {
  const { application } = useLoaderData<typeof loader>()

  return (
    <SimpleItem
      isLightIcon
      icon={<ApplicationStatusIcon status={application.status} />}
    >
      Candidature{" "}
      <ProseInlineAction asChild>
        <BaseLink to={Routes.show.applications.id(application.id).toString()}>
          {TRANSLATION_BY_APPLICATION_STATUS[application.status]}
        </BaseLink>
      </ProseInlineAction>
    </SimpleItem>
  )
}

function ItemExhibitorSpace() {
  const { exhibitor } = useLoaderData<typeof loader>()

  return (
    <SimpleItem
      isLightIcon
      icon={<Icon href="icon-arrow-up-right-from-square-light" />}
    >
      Voir son{" "}
      <ProseInlineAction asChild>
        <a
          href={`${CLIENT_ENV.SHOW_URL}/exposants/${exhibitor.token}`}
          target="_blank"
          rel="noreferrer"
        >
          espace exposant
        </a>
      </ProseInlineAction>
    </SimpleItem>
  )
}

function ItemLocationNumber() {
  const { exhibitor } = useLoaderData<typeof loader>()

  if (exhibitor.standNumber == null && exhibitor.locationNumber == null) {
    return null
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-expand-light" />}>
      {joinReactNodes(
        [
          exhibitor.standNumber != null ? (
            <Fragment key="stand-number">
              Stand nº
              <strong className="text-body-emphasis">
                {exhibitor.standNumber}
              </strong>
            </Fragment>
          ) : null,
          exhibitor.locationNumber != null ? (
            <Fragment key="location-number">
              Emplacement nº
              <strong className="text-body-emphasis">
                {exhibitor.locationNumber}
              </strong>
            </Fragment>
          ) : null,
        ].filter(Boolean),
        <br />,
      )}
    </SimpleItem>
  )
}

function ItemOrganizer() {
  const { exhibitor } = useLoaderData<typeof loader>()

  if (!exhibitor.isOrganizer) {
    return null
  }

  return (
    <SimpleItem icon={<Icon href="icon-show-solid" />}>
      Est organisateur
    </SimpleItem>
  )
}

function ItemOrganizersFavorite() {
  const { exhibitor } = useLoaderData<typeof loader>()

  if (!exhibitor.isOrganizersFavorite) {
    return null
  }

  return (
    <SimpleItem icon={<Icon href="icon-heart-light" />}>
      Est <strong className="text-body-emphasis">Coup de cœur</strong>
    </SimpleItem>
  )
}

function ItemRisingStar() {
  const { exhibitor } = useLoaderData<typeof loader>()

  if (!exhibitor.isRisingStar) {
    return null
  }

  return (
    <SimpleItem icon={<Icon href="icon-seedling-light" />}>
      Est <strong className="text-body-emphasis">Espoir</strong>
    </SimpleItem>
  )
}

function ItemSponsorship() {
  const { sponsor } = useLoaderData<typeof loader>()

  if (sponsor == null) {
    return null
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-award-light" />}>
      Sponsor{" "}
      <ProseInlineAction asChild>
        <BaseLink to={Routes.show.sponsors.id(sponsor.id).toString()}>
          {SponsorshipCategory.translation[sponsor.category]}
        </BaseLink>
      </ProseInlineAction>
    </SimpleItem>
  )
}

function ItemInvoiceStatus() {
  const { exhibitor } = useLoaderData<typeof loader>()

  if (exhibitor.invoiceStatus == null) {
    return null
  }

  return (
    <SimpleItem
      isLightIcon
      icon={<InvoiceIcon status={exhibitor.invoiceStatus} />}
    >
      {InvoiceStatus.translation[exhibitor.invoiceStatus]}
    </SimpleItem>
  )
}

function ItemVisibility() {
  const { exhibitor } = useLoaderData<typeof loader>()

  return (
    <SimpleItem
      icon={
        <VisibilityIcon
          visibility={Visibility.fromBoolean(exhibitor.isVisible)}
        />
      }
    >
      {exhibitor.isVisible ? (
        <>
          <strong className="text-body-emphasis">Est visible</strong> sur le
          site
        </>
      ) : (
        <>
          <strong className="text-body-emphasis">N’est pas visible</strong> sur
          le site
        </>
      )}
    </SimpleItem>
  )
}
