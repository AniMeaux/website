import { getErrorTitle } from "#core/data-display/error-page";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { services } from "#core/services/services.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import { SectionDocuments } from "./section-documents";
import { SectionHelper } from "./section-helper";
import { SectionStatus } from "./section-status";
import { SectionStructure } from "./section-structure";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const { documents, files, profile, application } = await promiseHash({
    documents: services.exhibitor.documents.getByToken(routeParams.token, {
      select: { status: true, statusMessage: true },
    }),

    files: services.exhibitor.documents.getFilesByToken(routeParams.token),

    profile: services.exhibitor.profile.getByToken(routeParams.token, {
      select: { name: true },
    }),

    application: services.exhibitor.application.getByToken(routeParams.token, {
      select: {
        billingAddress: true,
        billingCity: true,
        billingCountry: true,
        billingZipCode: true,
        structureAddress: true,
        structureCity: true,
        structureCountry: true,
        structureLegalStatus: true,
        structureOtherLegalStatus: true,
        structureSiret: true,
        structureZipCode: true,
      },
    }),
  });

  return {
    documents: { ...documents, ...files },
    profile,
    application,
    token: routeParams.token,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? ["Documents", data.profile.name] : getErrorTitle(404),
    ),
  });
};

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <FormLayout.Form asChild>
        <div>
          <SectionStatus />

          <SectionDocuments />

          <FormLayout.SectionSeparator />

          <SectionStructure />
        </div>
      </FormLayout.Form>

      <SectionHelper />
    </FormLayout.Root>
  );
}
