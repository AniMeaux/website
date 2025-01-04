import { getErrorTitle } from "#core/data-display/error-page";
import { email } from "#core/emails.server";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { badRequest } from "#core/response.server";
import { services } from "#core/services/services.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { createEmailTemplateRequest } from "#exhibitors/stand-configuration/email.server";
import { parseWithZod } from "@conform-to/zod";
import { ShowExhibitorStandConfigurationStatus } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { createPath } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import { ActionSchema } from "./action";
import { SectionForm } from "./section-form";
import { SectionHelper } from "./section-helper";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = RouteParamsSchema.parse(params);

  const { standConfiguration, profile } = await promiseHash({
    standConfiguration: services.exhibitor.standConfiguration.getByToken(
      routeParams.token,
      {
        select: {
          chairCount: true,
          dividerCount: true,
          dividerType: true,
          hasTablecloths: true,
          installationDay: true,
          peopleCount: true,
          placementComment: true,
          size: true,
          status: true,
          tableCount: true,
          updatedAt: true,
          zone: true,

          presentDogs: {
            select: {
              gender: true,
              idNumber: true,
              isCategorized: true,
              isSterilized: true,
            },
          },
        },
      },
    ),

    profile: services.exhibitor.profile.getByToken(routeParams.token, {
      select: {
        name: true,
        activityFields: true,
      },
    }),
  });

  if (
    standConfiguration.status ===
    ShowExhibitorStandConfigurationStatus.VALIDATED
  ) {
    throw redirect(
      createPath({
        pathname: Routes.exhibitors.token(routeParams.token).stand.toString(),
      }),
    );
  }

  return { standConfiguration, profile };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier le stand", data.profile.name]
        : getErrorTitle(404),
    ),
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = RouteParamsSchema.parse(params);

  const standConfiguration =
    await services.exhibitor.standConfiguration.getByToken(routeParams.token, {
      select: { status: true },
    });

  if (
    standConfiguration.status ===
    ShowExhibitorStandConfigurationStatus.VALIDATED
  ) {
    throw badRequest();
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  await services.exhibitor.standConfiguration.update(
    routeParams.token,
    {
      chairCount: submission.value.chairCount,
      dividerCount: submission.value.dividerCount,
      dividerType: submission.value.dividerType,
      hasTablecloths: submission.value.hasTablecloths,
      installationDay: submission.value.installationDay,
      peopleCount: submission.value.peopleCount,
      placementComment: submission.value.placementComment || null,
      size: submission.value.size,
      tableCount: submission.value.tableCount,
      zone: submission.value.zone,
    },
    submission.value.presentDogs,
  );

  email.send.template(createEmailTemplateRequest(routeParams.token));

  throw redirect(
    createPath({
      pathname: Routes.exhibitors.token(routeParams.token).stand.toString(),
    }),
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
