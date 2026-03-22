import { ShowExhibitorStatus } from "@animeaux/prisma"
import { safeParseRouteParam } from "@animeaux/zod-utils"
import { parseWithZod } from "@conform-to/zod"
import { parseFormData } from "@mjackson/form-data-parser"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"
import { captureException } from "@sentry/remix"
import { promiseHash } from "remix-utils/promise"

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

  const { exhibitor, files } = await promiseHash({
    exhibitor: services.exhibitor.getByToken(routeParams.token, {
      select: {
        documentStatus: true,
        name: true,
      },
    }),

    files: services.exhibitor.getFilesByToken(routeParams.token),
  })

  if (exhibitor.documentStatus === ShowExhibitorStatus.VALIDATED) {
    throw redirect(
      Routes.exhibitors.token(routeParams.token).documents.toString(),
    )
  }

  return { exhibitor: { ...exhibitor, ...files } }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier les documents", data.exhibitor.name]
        : getErrorTitle(404),
    ),
  })
}

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params)

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: { documentStatus: true, folderId: true },
  })

  if (exhibitor.documentStatus === ShowExhibitorStatus.VALIDATED) {
    throw badRequest()
  }

  const reversibleUpload = services.fileStorage.createReversibleUpload()

  const formData = await parseFormData(request, async (fileUpload) => {
    if (
      fileUpload.fieldName == null ||
      fileUpload.name === "" ||
      !["identificationFile", "insuranceFile", "kbisFile"].includes(
        fileUpload.fieldName,
      )
    ) {
      return undefined
    }

    try {
      return await reversibleUpload.upload(fileUpload, {
        parentFolderId: exhibitor.folderId,
      })
    } catch (error) {
      captureException(error)

      return undefined
    }
  })

  const submission = parseWithZod(formData, { schema: ActionSchema })

  if (submission.status !== "success") {
    await reversibleUpload.revert()

    return json(submission.reply(), { status: 400 })
  }

  try {
    await services.exhibitor.updateDocuments(routeParams.token, {
      identificationFileId:
        submission.value.identificationFile?.name ??
        submission.value.identificationFileCurrentId,
      insuranceFileId:
        submission.value.insuranceFile?.name ??
        submission.value.insuranceFileCurrentId,
      kbisFileId:
        submission.value.kbisFile?.name ?? submission.value.kbisFileCurrentId,
    })
  } catch (error) {
    await reversibleUpload.revert()

    throw error
  }

  void services.exhibitorEmail.document.submitted(routeParams.token)

  throw redirect(
    Routes.exhibitors.token(routeParams.token).documents.toString(),
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
