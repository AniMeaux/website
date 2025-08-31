import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const { exhibitor, files } = await promiseHash({
    exhibitor: services.exhibitor.getByToken(routeParams.token, {
      select: {
        token: true,
        sponsorship: { select: { category: true } },
        documentStatus: true,
        documentStatusMessage: true,
        dogsConfigurationStatus: true,
        name: true,
        publicProfileStatus: true,
        descriptionStatus: true,
        onStandAnimationsStatus: true,
        standNumber: true,
        standConfigurationStatus: true,
        invoices: { select: { status: true } },
      },
    }),

    files: services.fileStorage.getFiles(
      process.env.GOOGLE_DRIVE_SHARED_FOLDER_ID,
    ),
  });

  return { exhibitor, files };
}
