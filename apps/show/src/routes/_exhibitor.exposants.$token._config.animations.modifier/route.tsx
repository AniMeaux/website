import { getErrorTitle } from "#core/data-display/error-page";
import { email } from "#core/emails.server";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { badRequest } from "#core/response.server";
import { services } from "#core/services/services.server";
import { createEmailTemplateAnimationsOnStandUpdated } from "#exhibitors/profile/email.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { parseWithZod } from "@conform-to/zod";
import { ShowExhibitorProfileStatus } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { createPath } from "@remix-run/react";
import { ActionSchema } from "./action";
import { SectionForm } from "./section-form";
import { SectionHelper } from "./section-helper";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const profile = await services.exhibitor.profile.getByToken(
    routeParams.token,
    {
      select: {
        name: true,
        onStandAnimations: true,
        onStandAnimationsStatus: true,
      },
    },
  );

  if (
    profile.onStandAnimationsStatus === ShowExhibitorProfileStatus.VALIDATED
  ) {
    throw redirect(
      createPath({
        pathname: Routes.exhibitors
          .token(routeParams.token)
          .animations.toString(),
        hash: "on-stand-animations",
      }),
    );
  }

  return { profile };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier les animations", data.profile.name]
        : getErrorTitle(404),
    ),
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const profile = await services.exhibitor.profile.getByToken(
    routeParams.token,
    { select: { onStandAnimationsStatus: true } },
  );

  if (
    profile.onStandAnimationsStatus === ShowExhibitorProfileStatus.VALIDATED
  ) {
    throw badRequest();
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  await services.exhibitor.profile.updateOnStandAnimations(routeParams.token, {
    onStandAnimations: submission.value.onStandAnimations || null,
  });

  email.send.template(
    createEmailTemplateAnimationsOnStandUpdated(routeParams.token),
  );

  throw redirect(
    createPath({
      pathname: Routes.exhibitors
        .token(routeParams.token)
        .animations.toString(),
      hash: "on-stand-animations",
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
