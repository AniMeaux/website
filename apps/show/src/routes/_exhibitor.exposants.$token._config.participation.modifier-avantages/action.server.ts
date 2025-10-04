import { Routes } from "#core/navigation";
import { badRequest } from "#core/response.server";
import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { SectionId } from "#routes/_exhibitor.exposants.$token._config.participation._index/section-id.js";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { parseWithZod } from "@conform-to/zod";
import { ShowExhibitorStatus } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createActionSchema } from "./action-schema";

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: {
      peopleCount: true,
      perksStatus: true,
    },
  });

  if (exhibitor.perksStatus === ShowExhibitorStatus.VALIDATED) {
    throw badRequest();
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: createActionSchema({ peopleCount: exhibitor.peopleCount }),
  });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  await services.exhibitor.updatePerks(routeParams.token, {
    appetizerPeopleCount: submission.value.appetizerPeopleCount,
    breakfastPeopleCountSaturday: submission.value.breakfastPeopleCountSaturday,
    breakfastPeopleCountSunday: submission.value.breakfastPeopleCountSunday,
  });

  services.exhibitorEmail.perks.submitted(routeParams.token);

  throw redirect(
    Routes.exhibitors
      .token(routeParams.token)
      .participation.toString(SectionId.PERKS),
  );
}
