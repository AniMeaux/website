import { Routes } from "#i/core/navigation.js";
import { services } from "#i/core/services.server.js";
import { RouteParamsSchema } from "#i/exhibitors/route-params.js";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const { exhibitor, application, invoiceCount } = await promiseHash({
    exhibitor: services.exhibitor.getByToken(routeParams.token, {
      select: {
        token: true,
        name: true,

        billingAddress: true,
        billingCity: true,
        billingZipCode: true,
        billingCountry: true,
      },
    }),

    application: services.application.getByToken(routeParams.token, {
      select: {
        structureAddress: true,
        structureCity: true,
        structureZipCode: true,
        structureCountry: true,
      },
    }),

    invoiceCount: services.invoice.getCountByToken(routeParams.token),
  });

  if (invoiceCount > 0) {
    throw redirect(
      Routes.exhibitors.token(routeParams.token).invoice.toString(),
    );
  }

  return { exhibitor, application };
}
