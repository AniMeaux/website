import { getErrorTitle } from "#core/data-display/error-page";
import { email } from "#core/emails.server";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { badRequest } from "#core/response.server";
import { services } from "#core/services/services.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { StandConfigurationEmails } from "#exhibitors/stand-configuration/email.server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { parseWithZod } from "@conform-to/zod";
import { ShowExhibitorStatus } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { ActionSchema } from "./action";
import { SectionForm } from "./section-form";
import { SectionHelper } from "./section-helper";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: {
      name: true,
      activityFields: true,
      chairCount: true,
      dividerCount: true,
      dividerType: true,
      hasElectricalConnection: true,
      hasTablecloths: true,
      installationDay: true,
      peopleCount: true,
      placementComment: true,
      size: true,
      standConfigurationStatus: true,
      tableCount: true,
      updatedAt: true,
      zone: true,
    },
  });

  if (exhibitor.standConfigurationStatus === ShowExhibitorStatus.VALIDATED) {
    throw redirect(Routes.exhibitors.token(routeParams.token).stand.toString());
  }

  return { exhibitor };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier la configuration de stand", data.exhibitor.name]
        : getErrorTitle(404),
    ),
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: { standConfigurationStatus: true },
  });

  if (exhibitor.standConfigurationStatus === ShowExhibitorStatus.VALIDATED) {
    throw badRequest();
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  await services.exhibitor.updateStand(routeParams.token, {
    chairCount: submission.value.chairCount,
    dividerCount: submission.value.dividerCount,
    dividerType: submission.value.dividerType,
    hasElectricalConnection: submission.value.hasElectricalConnection,
    hasTablecloths: submission.value.hasTablecloths,
    installationDay: submission.value.installationDay,
    peopleCount: submission.value.peopleCount,
    placementComment: submission.value.placementComment || null,
    size: submission.value.size,
    tableCount: submission.value.tableCount,
    zone: submission.value.zone,
  });

  email.send.template(StandConfigurationEmails.submitted(routeParams.token));

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
