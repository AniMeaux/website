import { BaseLink } from "#core/base-link";
import { Routes } from "#core/navigation";
import { ActivityFieldIcon } from "#show/activity-field/icon";
import { ActivityTargetIcon } from "#show/activity-target/icon";
import { LEGAL_STATUS_TRANSLATION } from "#show/applications/legal-status";
import { StatusIcon } from "#show/applications/status";
import type { SerializeFrom } from "@remix-run/node";
import { DateTime } from "luxon";
import type { loader } from "./route";

export function ApplicationItem({
  application,
}: {
  application: SerializeFrom<typeof loader>["applications"][number];
}) {
  return (
    <BaseLink
      to={Routes.show.applications.id(application.id).toString()}
      className="col-span-full grid grid-cols-subgrid items-center rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:px-1"
    >
      <StatusIcon status={application.status} className="icon-20" />

      <span className="text-body-emphasis">{application.structureName}</span>

      <span className="hidden @lg/card-content:inline">
        {application.structureLegalStatus != null
          ? LEGAL_STATUS_TRANSLATION[application.structureLegalStatus]
          : application.structureOtherLegalStatus}
      </span>

      <span className="hidden grid-flow-col justify-end gap-0.5 @3xl/card-content:grid">
        {application.structureActivityTargets.map((activityTarget) => (
          <ActivityTargetIcon
            key={activityTarget}
            activityTarget={activityTarget}
            className="icon-20"
          />
        ))}
      </span>

      <span className="hidden grid-flow-col justify-start gap-0.5 @3xl/card-content:grid">
        {application.structureActivityFields.map((activityField) => (
          <ActivityFieldIcon
            key={activityField}
            activityField={activityField}
            className="icon-20"
          />
        ))}
      </span>

      <span
        title={`Candidature reçu le ${DateTime.fromISO(application.createdAt).toLocaleString(DateTime.DATETIME_MED)}`}
        className="text-right"
      >
        {DateTime.fromISO(application.createdAt).toLocaleString({
          ...DateTime.DATE_MED,
          year: undefined,
        })}
      </span>
    </BaseLink>
  );
}
