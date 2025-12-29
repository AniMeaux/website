import { Action } from "#core/actions.js";
import { BaseLink } from "#core/base-link.js";
import { SimpleEmpty } from "#core/data-display/empty.js";
import { DynamicImage } from "#core/data-display/image.js";
import { toRoundedRelative } from "#core/dates.js";
import { Card } from "#core/layout/card.js";
import { Routes } from "#core/navigation.js";
import { ActivityFieldIcon } from "#show/exhibitors/activity-field/icon.js";
import {
  ApplicationSearchParams,
  ApplicationSearchParamsN,
} from "#show/exhibitors/applications/search-params.js";
import { ImageUrl } from "@animeaux/core";
import { ShowExhibitorApplicationStatus } from "@animeaux/prisma";
import type { SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./loader.server";

export function CardUntreatedApplications() {
  const { show } = useLoaderData<typeof loader>();

  if (show == null) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {show.untreatedApplications.totalCount === 0
            ? "Candidature non traitée"
            : show.untreatedApplications.totalCount > 1
              ? `${show.untreatedApplications.totalCount} candidatures non traitée`
              : "1 candidature non traitée"}
        </Card.Title>

        {show.untreatedApplications.totalCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.show.applications.toString(),
                search: ApplicationSearchParams.format({
                  sort: ApplicationSearchParamsN.Sort.CREATED_AT,
                  statuses: new Set([ShowExhibitorApplicationStatus.UNTREATED]),
                }),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasListItems>
        {show.untreatedApplications.totalCount === 0 ? (
          <SimpleEmpty
            isCompact
            icon="📝"
            iconAlt="Memo"
            title="Aucune candidature non traitée"
            titleElementType="h3"
            message="Pour l’instant ;)"
          />
        ) : (
          <ul className="grid grid-cols-1">
            {show.untreatedApplications.applications.map((application) => (
              <li key={application.id} className="flex flex-col">
                <ApplicationItem application={application} />
              </li>
            ))}
          </ul>
        )}
      </Card.Content>
    </Card>
  );
}

function ApplicationItem({
  application,
}: {
  application: NonNullable<
    SerializeFrom<typeof loader>["show"]
  >["untreatedApplications"]["applications"][number];
}) {
  return (
    <BaseLink
      to={Routes.show.applications.id(application.id).toString()}
      className="grid grid-cols-[auto_minmax(0px,1fr)_auto] items-center gap-1 rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:px-1"
    >
      <DynamicImage
        imageId={ImageUrl.parse(application.structureLogoPath).id}
        alt={application.structureName}
        sizeMapping={{ default: "60px" }}
        fallbackSize="128"
        background="none"
        className="h-4 rounded-0.5 border border-gray-200 bg-white"
      />

      <div className="flex flex-col">
        <p className="truncate text-body-emphasis">
          {application.structureName}
        </p>

        <p
          title={`Candidature reçu le ${DateTime.fromISO(application.createdAt).toLocaleString(DateTime.DATETIME_MED)}`}
          className="text-gray-500 text-caption-default"
        >
          {toRoundedRelative(application.createdAt)}
        </p>
      </div>

      <span className="grid grid-flow-col justify-start gap-0.5">
        {application.structureActivityFields.map((activityField) => (
          <ActivityFieldIcon
            key={activityField}
            activityField={activityField}
            className="icon-20"
          />
        ))}
      </span>
    </BaseLink>
  );
}
