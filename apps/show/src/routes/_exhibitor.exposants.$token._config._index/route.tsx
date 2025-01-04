import { getErrorTitle } from "#core/data-display/error-page";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { services } from "#core/services/services.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import { SectionAwaitingValidation } from "./section-awaiting-validation";
import { SectionHelper } from "./section-helper";
import { SectionPartnership } from "./section-partnership";
import { SectionPayment } from "./section-payment";
import { SectionStandNumber } from "./section-stand-number";
import { SectionToComplete } from "./section-to-complete";
import { SectionValidated } from "./section-validated";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = RouteParamsSchema.parse(params);

  const { exhibitor, application, profile, standConfiguration, documents } =
    await promiseHash({
      exhibitor: services.exhibitor.getByToken(routeParams.token, {
        select: { hasPaid: true, partnership: { select: { category: true } } },
      }),

      application: services.exhibitor.application.getByToken(
        routeParams.token,
        {
          select: { otherPartnershipCategory: true },
        },
      ),

      profile: services.exhibitor.profile.getByToken(routeParams.token, {
        select: { name: true, description: true },
      }),

      standConfiguration: services.exhibitor.standConfiguration.getByToken(
        routeParams.token,
        {
          select: {
            standNumber: true,
            status: true,
            statusMessage: true,
          },
        },
      ),

      documents: services.exhibitor.documents.getByToken(routeParams.token, {
        select: { status: true, statusMessage: true },
      }),
    });

  return {
    exhibitor,
    application,
    profile,
    standConfiguration,
    documents,
    token: routeParams.token,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? ["Tableau de bord", data.profile.name]
        : getErrorTitle(404),
    ),
  });
};

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <FormLayout.Form asChild>
        <div>
          <SectionStandNumber />
          <SectionPayment />

          <SectionToComplete />
          <SectionAwaitingValidation />
          <SectionValidated />

          <SectionPartnership />
        </div>
      </FormLayout.Form>

      <SectionHelper />
    </FormLayout.Root>
  );
}
