import type { SerializeFrom } from "@remix-run/node"
import { DateTime } from "luxon"

import { BaseLink } from "#i/core/base-link.js"
import { toRoundedRelative } from "#i/core/dates.js"
import { Routes } from "#i/core/navigation.js"
import { ApplicationStatusIcon } from "#i/show/exhibitors/applications/status.js"

import type { loader } from "./loader.server.js"

type Application = SerializeFrom<typeof loader>["applications"][number]

export function ApplicationItem({ application }: { application: Application }) {
  return (
    <BaseLink
      to={Routes.show.applications.id(application.id).toString()}
      className="col-span-full grid grid-cols-subgrid items-center rounded-0.5 bg-white px-0.5 py-1 hover:bg-gray-100 focus-visible:z-10 focus-visible:focus-ring md:px-1"
    >
      <ApplicationStatusIcon status={application.status} className="icon-2" />

      <span className="text-body-emphasis">{application.structureName}</span>

      <p
        title={`Candidature reçu le ${DateTime.fromISO(application.createdAt).toLocaleString(DateTime.DATETIME_MED)}`}
        className="justify-self-end"
      >
        {toRoundedRelative(application.createdAt)}
      </p>
    </BaseLink>
  )
}
