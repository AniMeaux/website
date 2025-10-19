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
        descriptionStatus: true,
        documentStatus: true,
        documentStatusMessage: true,
        dogsConfigurationStatus: true,
        isOrganizersFavorite: true,
        isRisingStar: true,
        name: true,
        onStandAnimationsStatus: true,
        perksStatus: true,
        publicProfileStatus: true,
        standConfigurationStatus: true,
        standNumber: true,
        token: true,

        invoices: { select: { status: true } },

        sponsorship: { select: { category: true } },
      },
    }),

    files: services.fileStorage.getFiles(
      process.env.GOOGLE_DRIVE_SHARED_FOLDER_ID,
    ),
  });

  return { exhibitor, files };
}
