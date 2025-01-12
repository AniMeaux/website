import { getErrorTitle } from "#core/data-display/error-page";
import { email } from "#core/emails.server";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { badRequest } from "#core/response.server";
import { services } from "#core/services/services.server";
import { createEmailTemplateRequest } from "#exhibitors/dogs-configuration/email.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { parseWithZod } from "@conform-to/zod";
import { ShowExhibitorDogsConfigurationStatus } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import { ActionSchema } from "./action";
import { SectionForm } from "./section-form";
import { SectionHelper } from "./section-helper";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const { dogsConfiguration, profile } = await promiseHash({
    dogsConfiguration: services.exhibitor.dogsConfiguration.getByToken(
      routeParams.token,
      {
        select: {
          status: true,

          dogs: {
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
      select: { name: true },
    }),
  });

  if (
    dogsConfiguration.status === ShowExhibitorDogsConfigurationStatus.VALIDATED
  ) {
    throw redirect(Routes.exhibitors.token(routeParams.token).stand.toString());
  }

  return { dogsConfiguration, profile };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier les chiens sur stand", data.profile.name]
        : getErrorTitle(404),
    ),
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const dogsConfiguration =
    await services.exhibitor.dogsConfiguration.getByToken(routeParams.token, {
      select: { status: true },
    });

  if (
    dogsConfiguration.status === ShowExhibitorDogsConfigurationStatus.VALIDATED
  ) {
    throw badRequest();
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  await services.exhibitor.dogsConfiguration.update(
    routeParams.token,
    submission.value.dogs,
  );

  email.send.template(createEmailTemplateRequest(routeParams.token));

  throw redirect(Routes.exhibitors.token(routeParams.token).stand.toString());
}

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <SectionForm />
      <SectionHelper />
    </FormLayout.Root>
  );
}
