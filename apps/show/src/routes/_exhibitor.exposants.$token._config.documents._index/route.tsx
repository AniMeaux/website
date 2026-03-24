import { safeParseRouteParam } from "@animeaux/zod-utils"
import type { LoaderFunctionArgs } from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"
import { promiseHash } from "remix-utils/promise"

import { getErrorTitle } from "#i/core/data-display/error-page.js"
import { FormLayout } from "#i/core/layout/form-layout.js"
import { createSocialMeta } from "#i/core/meta.js"
import { getPageTitle } from "#i/core/page-title.js"
import { services } from "#i/core/services.server.js"
import { RouteParamsSchema } from "#i/exhibitors/route-params.js"

import { SectionDocuments } from "./section-documents.js"
import { SectionHelper } from "./section-helper.js"
import { SectionStructure } from "./section-structure.js"

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params)

  const { exhibitor, files, application } = await promiseHash({
    exhibitor: services.exhibitor.getByToken(routeParams.token, {
      select: {
        token: true,
        documentStatus: true,
        documentStatusMessage: true,
        name: true,
      },
    }),

    files: services.exhibitor.getFilesByToken(routeParams.token),

    application: services.application.getByToken(routeParams.token, {
      select: {
        structureAddress: true,
        structureCity: true,
        structureCountry: true,
        structureLegalStatus: true,
        structureLegalStatusOther: true,
        structureSiret: true,
        structureZipCode: true,
      },
    }),
  })

  return {
    exhibitor: { ...exhibitor, ...files },
    application,
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? ["Documents", data.exhibitor.name] : getErrorTitle(404),
    ),
  })
}

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <FormLayout.Form asChild>
        <div>
          <SectionDocuments />

          <FormLayout.SectionSeparator />

          <SectionStructure />
        </div>
      </FormLayout.Form>

      <SectionHelper />
    </FormLayout.Root>
  )
}
