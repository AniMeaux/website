import { ShowExhibitorStatus } from "@animeaux/prisma"
import { safeParseRouteParam } from "@animeaux/zod-utils"
import { parseWithZod } from "@conform-to/zod"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"
import { createPath } from "@remix-run/react"

import { getErrorTitle } from "#i/core/data-display/error-page.js"
import { FormLayout } from "#i/core/layout/form-layout.js"
import { createSocialMeta } from "#i/core/meta.js"
import { Routes } from "#i/core/navigation.js"
import { getPageTitle } from "#i/core/page-title.js"
import { badRequest } from "#i/core/response.server.js"
import { services } from "#i/core/services.server.js"
import { RouteParamsSchema } from "#i/exhibitors/route-params.js"

import { ActionSchema } from "./action.js"
import { SectionForm } from "./section-form.js"
import { SectionHelper } from "./section-helper.js"

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params)

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: { description: true, descriptionStatus: true, name: true },
  })

  if (exhibitor.descriptionStatus === ShowExhibitorStatus.VALIDATED) {
    throw redirect(
      createPath({
        pathname: Routes.exhibitors.token(routeParams.token).profile.toString(),
        hash: "description",
      }),
    )
  }

  return { exhibitor }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier la description", data.exhibitor.name]
        : getErrorTitle(404),
    ),
  })
}

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params)

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: { descriptionStatus: true },
  })

  if (exhibitor.descriptionStatus === ShowExhibitorStatus.VALIDATED) {
    throw badRequest()
  }

  const formData = await request.formData()

  const submission = parseWithZod(formData, { schema: ActionSchema })

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 })
  }

  await services.exhibitor.updateDescription(routeParams.token, {
    description: submission.value.description || null,
  })

  void services.exhibitorEmail.description.submitted(routeParams.token)

  throw redirect(
    createPath({
      pathname: Routes.exhibitors.token(routeParams.token).profile.toString(),
      hash: "description",
    }),
  )
}

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <SectionForm />
      <SectionHelper />
    </FormLayout.Root>
  )
}
