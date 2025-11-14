import { getErrorTitle } from "#core/data-display/error-page";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { badRequest } from "#core/response.server";
import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { ShowExhibitorStatus } from "@animeaux/prisma";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { parseWithZod } from "@conform-to/zod";
import { parseFormData } from "@mjackson/form-data-parser";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { captureException } from "@sentry/remix";
import { v4 as uuid } from "uuid";
import { ActionSchema } from "./action";
import { SectionForm } from "./section-form";
import { SectionHelper } from "./section-helper";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: {
      activityFields: true,
      activityTargets: true,
      links: true,
      logoPath: true,
      name: true,
      publicProfileStatus: true,
    },
  });

  if (exhibitor.publicProfileStatus === ShowExhibitorStatus.VALIDATED) {
    throw redirect(
      Routes.exhibitors.token(routeParams.token).profile.toString(),
    );
  }

  return { exhibitor };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier le profil public", data.exhibitor.name]
        : getErrorTitle(404),
    ),
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: { publicProfileStatus: true },
  });

  if (exhibitor.publicProfileStatus === ShowExhibitorStatus.VALIDATED) {
    throw badRequest();
  }

  const reversibleUpload = services.image.createReversibleUpload();

  async function revertUpload() {
    const errors = await reversibleUpload.revert();

    if (errors != null) {
      captureException(new Error("Could not delete exhibitor logo"), {
        extra: {
          errors: errors.map(({ error, ...rest }) => ({
            ...rest,
            error: error instanceof Error ? error.message : String(error),
          })),
        },
      });
    }
  }

  const formData = await parseFormData(request, async (fileUpload) => {
    if (fileUpload.fieldName !== "logo" || fileUpload.name === "") {
      return undefined;
    }

    try {
      return await reversibleUpload.upload(fileUpload, {
        imageId: `show/exhibitors-logo/${uuid()}`,
      });
    } catch (error) {
      captureException(error);

      return undefined;
    }
  });

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    await revertUpload();

    return json(submission.reply(), { status: 400 });
  }

  try {
    await services.exhibitor.updatePublicProfile(routeParams.token, {
      activityTargets: submission.value.activityTargets,
      activityFields: submission.value.activityFields,
      links: submission.value.links,
      logoPath: submission.value.logo?.name,
    });
  } catch (error) {
    await revertUpload();

    throw error;
  }

  services.exhibitorEmail.publicProfile.submitted(routeParams.token);

  throw redirect(Routes.exhibitors.token(routeParams.token).profile.toString());
}

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <SectionForm />
      <SectionHelper />
    </FormLayout.Root>
  );
}
