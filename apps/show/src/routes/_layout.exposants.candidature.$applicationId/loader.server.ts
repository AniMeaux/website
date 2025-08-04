import { notFound } from "#core/response.server";
import { services } from "#core/services.server.js";
import { safeParseRouteParam, zu } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  if (process.env.FEATURE_FLAG_EXHIBITOR_APPLICATION_ONLINE !== "true") {
    throw notFound();
  }

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const application = await services.application.get(
    routeParams.applicationId,
    { select: { contactEmail: true } },
  );

  return { application };
}

const RouteParamsSchema = zu.object({
  applicationId: zu.string().uuid(),
});
