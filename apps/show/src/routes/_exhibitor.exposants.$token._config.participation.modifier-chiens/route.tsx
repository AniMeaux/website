import { getErrorTitle } from "#i/core/data-display/error-page";
import { FormLayout } from "#i/core/layout/form-layout";
import { createSocialMeta } from "#i/core/meta";
import { Routes } from "#i/core/navigation";
import { getPageTitle } from "#i/core/page-title";
import { badRequest } from "#i/core/response.server";
import { services } from "#i/core/services.server.js";
import { RouteParamsSchema } from "#i/exhibitors/route-params";
import { SectionId } from "#i/routes/_exhibitor.exposants.$token._config.participation._index/section-id.js";
import { ShowExhibitorStatus } from "@animeaux/prisma";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { parseWithZod } from "@conform-to/zod";
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
    select: {
      dogsConfigurationStatus: true,

      dogs: {
        select: {
          gender: true,
          idNumber: true,
          isCategorized: true,
          isSterilized: true,
        },
      },

      name: true,
    },
  });

  if (exhibitor.dogsConfigurationStatus === ShowExhibitorStatus.VALIDATED) {
    throw redirect(
      createPath({
        pathname: Routes.exhibitors
          .token(routeParams.token)
          .participation.toString(SectionId.DOGS),
        hash: "dogs",
      }),
    );
  }

  return { exhibitor };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Modifier les chiens sur stand", data.exhibitor.name]
        : getErrorTitle(404),
    ),
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: { dogsConfigurationStatus: true },
  });

  if (exhibitor.dogsConfigurationStatus === ShowExhibitorStatus.VALIDATED) {
    throw badRequest();
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  await services.exhibitor.updateDogs(routeParams.token, submission.value.dogs);

  services.exhibitorEmail.dogConfiguration.submitted(routeParams.token);

  throw redirect(
    Routes.exhibitors
      .token(routeParams.token)
      .participation.toString(SectionId.DOGS),
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
