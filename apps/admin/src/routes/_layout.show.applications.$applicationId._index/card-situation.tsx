import { Action, ProseInlineAction } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { StatusIcon, TRANSLATION_BY_STATUS } from "#show/applications/status";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./route";

export function CardSituation() {
  const { application } = useLoaderData<typeof loader>();

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
            icon={<StatusIcon status={application.status} />}
          >
            Est{" "}
            <strong className="text-body-emphasis">
              {TRANSLATION_BY_STATUS[application.status]}
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
                  {application.exhibitor.profile?.name}
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
  );
}
