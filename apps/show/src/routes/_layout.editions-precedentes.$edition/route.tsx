import { safeParseRouteParam, zu } from "@animeaux/zod-utils"
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { defer } from "@remix-run/node"

import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js"
import { createSocialMeta } from "#i/core/meta.js"
import { getPageTitle } from "#i/core/page-title.js"
import { services } from "#i/core/services.server.js"
import { PreviousEdition } from "#i/previous-editions/previous-edition.js"

import { SectionPictures } from "./section-pictures.js"
import { SectionTitle } from "./section-title.js"

const ParamsSchema = zu.object({
  edition: zu.nativeEnum(PreviousEdition),
})

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(ParamsSchema, params)

  return defer({
    edition: routeParams.edition,
    pictures: services.image.getAllImages(routeParams.edition),
  })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? `Édition de ${data.edition}` : getErrorTitle(404),
    ),
  })
}

export function ErrorBoundary() {
  return <ErrorPage />
}

export default function Route() {
  return (
    <>
      <SectionTitle />
      <SectionPictures />
    </>
  )
}
