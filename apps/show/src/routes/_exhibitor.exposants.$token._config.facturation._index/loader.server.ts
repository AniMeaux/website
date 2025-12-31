import { services } from "#i/core/services.server.js";
import { RouteParamsSchema } from "#i/exhibitors/route-params.js";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const { exhibitor, invoices } = await promiseHash({
    exhibitor: services.exhibitor.getByToken(routeParams.token, {
      select: {
        id: true,
        token: true,
        name: true,

        billingAddress: true,
        billingCity: true,
        billingZipCode: true,
        billingCountry: true,
      },
    }),

    invoices: services.invoice.getManyByToken(routeParams.token, {
      select: {
        id: true,
        amount: true,
        dueDate: true,
        number: true,
        status: true,
        url: true,
      },
    }),
  });

  return { exhibitor, invoices };
}
