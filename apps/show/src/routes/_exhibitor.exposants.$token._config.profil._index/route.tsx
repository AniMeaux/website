import { safeParseRouteParam } from "@animeaux/zod-utils"
import type { LoaderFunctionArgs } from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"

import { getErrorTitle } from "#i/core/data-display/error-page.js"
import { FormLayout } from "#i/core/layout/form-layout.js"
import { createSocialMeta } from "#i/core/meta.js"
import { getPageTitle } from "#i/core/page-title.js"
import { services } from "#i/core/services.server.js"
import { RouteParamsSchema } from "#i/exhibitors/route-params.js"

import { SectionDescription } from "./section-description.js"
import { SectionHelper } from "./section-helper.js"
import { SectionPublicProfile } from "./section-public-profile.js"

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params)

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: {
      token: true,
      activityFields: true,
      activityTargets: true,
      description: true,
      descriptionStatus: true,
      descriptionStatusMessage: true,
      links: true,
      logoPath: true,
      name: true,
      publicProfileStatus: true,
      publicProfileStatusMessage: true,
    },
  })

  return { exhibitor }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? ["Profil", data.exhibitor.name] : getErrorTitle(404),
    ),
  })
}

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <FormLayout.Form asChild>
        <div>
          <SectionPublicProfile />
          <FormLayout.SectionSeparator />
          <SectionDescription />
        </div>
      </FormLayout.Form>

      <SectionHelper />
    </FormLayout.Root>
  )
}
