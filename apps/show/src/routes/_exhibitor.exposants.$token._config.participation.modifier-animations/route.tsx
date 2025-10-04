import { getErrorTitle } from "#core/data-display/error-page";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { badRequest } from "#core/response.server";
import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { SectionId } from "#routes/_exhibitor.exposants.$token._config.participation._index/section-id.js";
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
      onStandAnimations: true,
      onStandAnimationsStatus: true,
    },
  });

  if (exhibitor.onStandAnimationsStatus === ShowExhibitorStatus.VALIDATED) {
    throw redirect(
      Routes.exhibitors
        .token(routeParams.token)
        .participation.toString(SectionId.ON_STAND_ANIMATIONS),
    );
  }

  return { exhibitor };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier les animations", data.exhibitor.name]
        : getErrorTitle(404),
    ),
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: { onStandAnimationsStatus: true },
  });

  if (exhibitor.onStandAnimationsStatus === ShowExhibitorStatus.VALIDATED) {
    throw badRequest();
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  await services.exhibitor.updateOnStandAnimations(routeParams.token, {
    onStandAnimations: submission.value.onStandAnimations || null,
  });

  services.exhibitorEmail.onStandAnimation.submitted(routeParams.token);

  throw redirect(
    Routes.exhibitors
      .token(routeParams.token)
      .participation.toString(SectionId.ON_STAND_ANIMATIONS),
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
