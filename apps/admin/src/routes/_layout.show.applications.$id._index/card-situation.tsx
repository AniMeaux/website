import { useLoaderData } from "@remix-run/react"
import { DateTime } from "luxon"

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

import type { loader } from "./loader.server.js"

export function CardSituation() {
  const { application } = useLoaderData<typeof loader>()

  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>

        <Action asChild variant="text">
          <BaseLink
            to={Routes.show.applications.id(application.id).edit.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem
            isLightIcon
            icon={<ApplicationStatusIcon status={application.status} />}
          >
            Est{" "}
            <strong className="text-body-emphasis">
              {TRANSLATION_BY_APPLICATION_STATUS[application.status]}
            </strong>
          </SimpleItem>

          {application.exhibitor != null ? (
            <SimpleItem isLightIcon icon={<Icon href="icon-store-light" />}>
              Exposant{" "}
              <ProseInlineAction asChild>
                <BaseLink
                  to={Routes.show.exhibitors
                    .id(application.exhibitor.id)
                    .toString()}
                >
                  {application.exhibitor.name}
                </BaseLink>
              </ProseInlineAction>
            </SimpleItem>
          ) : null}

          <SimpleItem isLightIcon icon={<Icon href="icon-clock-light" />}>
            Candidature reçu le{" "}
            <strong className="text-body-emphasis">
              {DateTime.fromISO(application.createdAt).toLocaleString(
                DateTime.DATETIME_MED,
              )}
            </strong>
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  )
}
