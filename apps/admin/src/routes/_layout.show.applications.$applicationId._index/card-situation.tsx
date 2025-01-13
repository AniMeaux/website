import { Action, ProseInlineAction } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { STATUS_TRANSLATION, StatusIcon } from "#show/applications/status";
import { useLoaderData } from "@remix-run/react";
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
          <SimpleItem icon={<StatusIcon status={application.status} />}>
            Est{" "}
            <strong className="text-body-emphasis">
              {STATUS_TRANSLATION[application.status]}
            </strong>
          </SimpleItem>

          {application.exhibitor != null ? (
            <SimpleItem icon={<Icon href="icon-store-solid" />}>
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
        </ItemList>
      </Card.Content>
    </Card>
  );
}
