import type { MetaFunction } from "@remix-run/react"

import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js"
import { PageLayout } from "#i/core/layout/page.js"
import { getPageTitle } from "#i/core/page-title.js"

import { CardActivityDescription } from "./card-activity-description.js"
import { CardComments } from "./card-comments.js"
import { CardContact } from "./card-contact.js"
import { CardDiscoverySource } from "./card-discovery-source.js"
import { CardMotivation } from "./card-motivation.js"
import { CardParticipation } from "./card-participation.js"
import { CardSituation } from "./card-situation.js"
import { CardSituationRefusalMessage } from "./card-situation-refusal-message.js"
import { CardSponsorship } from "./card-sponsorship.js"
import { CardStructure } from "./card-structure.js"
import { Header } from "./header.js"
import type { loader } from "./loader.server.js"

export { action } from "./action.server.js"
export { loader } from "./loader.server.js"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: getPageTitle(
        data?.application.structureName != null
          ? `Candidature de ${data.application.structureName}`
          : getErrorTitle(404),
      ),
    },
  ]
}

export function ErrorBoundary() {
  return (
    <PageLayout.Content className="grid grid-cols-1">
      <ErrorPage />
    </PageLayout.Content>
  )
}

export default function Route() {
  return (
    <>
      <Header />

      <PageLayout.Content className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
        <div className="grid grid-cols-1 gap-1 md:col-start-2 md:row-start-1 md:gap-2">
          <CardSituation />
          <CardSituationRefusalMessage />
          <CardContact />
        </div>

        <div className="grid grid-cols-1 gap-1 md:gap-2">
          <CardStructure />
          <CardActivityDescription />
          <CardParticipation />
          <CardComments />

          <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
            <CardSponsorship />
            <CardDiscoverySource />
          </div>

          <CardMotivation />
        </div>
      </PageLayout.Content>
    </>
  )
}
