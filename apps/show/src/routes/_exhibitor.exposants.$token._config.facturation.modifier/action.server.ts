import { Routes } from "#core/navigation.js";
import { badRequest } from "#core/response.server.js";
import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params.js";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";
import { actionSchema } from "./action";

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const { invoiceCount, application } = await promiseHash({
    invoiceCount: services.invoice.getCountByToken(routeParams.token),

    application: services.application.getByToken(routeParams.token, {
      select: {
        structureAddress: true,
        structureCity: true,
        structureZipCode: true,
        structureCountry: true,
      },
    }),
  });

  if (invoiceCount > 0) {
    throw badRequest();
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: actionSchema });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  await services.invoice.updateAddress(
    routeParams.token,
    submission.value.sameAsStructure === "on"
      ? {
          billingAddress: application.structureAddress,
          billingZipCode: application.structureZipCode,
          billingCity: application.structureCity,
          billingCountry: application.structureCountry,
        }
      : {
          billingAddress: submission.value.address,
          billingZipCode: submission.value.zipCode,
          billingCity: submission.value.city,
          billingCountry: submission.value.country,
        },
  );

  services.invoiceEmail.billingAddressChanged(routeParams.token);

  throw redirect(Routes.exhibitors.token(routeParams.token).invoice.toString());
}
