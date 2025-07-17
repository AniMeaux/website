import { getErrorTitle } from "#core/data-display/error-page";
import { email } from "#core/emails.server";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { badRequest } from "#core/response.server";
import { services } from "#core/services/services.server";
import { DocumentsEmails } from "#exhibitors/documents/email.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { parseWithZod } from "@conform-to/zod";
import { parseFormData } from "@mjackson/form-data-parser";
import { ShowExhibitorDocumentsStatus } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { captureException } from "@sentry/remix";
import { promiseHash } from "remix-utils/promise";
import { ActionSchema } from "./action";
import { SectionForm } from "./section-form";
import { SectionHelper } from "./section-helper";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const { documents, files, profile } = await promiseHash({
    documents: services.exhibitor.documents.getByToken(routeParams.token, {
      select: { status: true },
    }),

    files: services.exhibitor.documents.getFilesByToken(routeParams.token),

    profile: services.exhibitor.profile.getByToken(routeParams.token, {
      select: { name: true },
    }),
  });

  if (documents.status === ShowExhibitorDocumentsStatus.VALIDATED) {
    throw redirect(
      Routes.exhibitors.token(routeParams.token).documents.toString(),
    );
  }

  return { documents: { ...documents, ...files }, profile };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier les documents", data.profile.name]
        : getErrorTitle(404),
    ),
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const documents = await services.exhibitor.documents.getByToken(
    routeParams.token,
    { select: { status: true, folderId: true } },
  );

  if (documents.status === ShowExhibitorDocumentsStatus.VALIDATED) {
    throw badRequest();
  }

  const reversibleUpload = services.fileStorage.createReversibleUpload();

  const formData = await parseFormData(request, async (fileUpload) => {
    if (
      fileUpload.fieldName == null ||
      fileUpload.name === "" ||
      !["identificationFile", "insuranceFile", "kbisFile"].includes(
        fileUpload.fieldName,
      )
    ) {
      return undefined;
    }

    try {
      return await reversibleUpload.upload(fileUpload, {
        parentFolderId: documents.folderId,
      });
    } catch (error) {
      captureException(error);

      return undefined;
    }
  });

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    await reversibleUpload.revert();

    return json(submission.reply(), { status: 400 });
  }

  try {
    await services.exhibitor.documents.update(routeParams.token, {
      identificationFileId:
        submission.value.identificationFile?.name ??
        submission.value.identificationFileCurrentId,
      insuranceFileId:
        submission.value.insuranceFile?.name ??
        submission.value.insuranceFileCurrentId,
      kbisFileId:
        submission.value.kbisFile?.name ?? submission.value.kbisFileCurrentId,
    });
  } catch (error) {
    await reversibleUpload.revert();

    throw error;
  }

  email.send.template(DocumentsEmails.submitted(routeParams.token));

  throw redirect(
    Routes.exhibitors.token(routeParams.token).documents.toString(),
  );
}

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <SectionForm />
      <SectionHelper />
    </FormLayout.Root>
  );
}
