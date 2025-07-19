import { getErrorTitle } from "#core/data-display/error-page";
import { email } from "#core/emails.server";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { badRequest } from "#core/response.server";
import { services } from "#core/services/services.server";
import { createEmailTemplateDescriptionUpdated } from "#exhibitors/profile/email.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { parseWithZod } from "@conform-to/zod";
import { ShowExhibitorStatus } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { createPath } from "@remix-run/react";
import { ActionSchema } from "./action";
import { SectionForm } from "./section-form";
import { SectionHelper } from "./section-helper";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: { description: true, descriptionStatus: true, name: true },
  });

  if (exhibitor.descriptionStatus === ShowExhibitorStatus.VALIDATED) {
    throw redirect(
      createPath({
        pathname: Routes.exhibitors.token(routeParams.token).profile.toString(),
        hash: "description",
      }),
    );
  }

  return { exhibitor };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier la description", data.exhibitor.name]
        : getErrorTitle(404),
    ),
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: { descriptionStatus: true },
  });

  if (exhibitor.descriptionStatus === ShowExhibitorStatus.VALIDATED) {
    throw badRequest();
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  await services.exhibitor.updateDescription(routeParams.token, {
    description: submission.value.description || null,
  });

  email.send.template(createEmailTemplateDescriptionUpdated(routeParams.token));

  throw redirect(
    createPath({
      pathname: Routes.exhibitors.token(routeParams.token).profile.toString(),
      hash: "description",
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
