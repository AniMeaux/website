import { getErrorTitle } from "#core/data-display/error-page";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { SectionDogs } from "./section-dogs";
import { SectionHelper } from "./section-helper";
import { SectionStandConfiguration } from "./section-stand-configuration";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: {
      token: true,
      dogsConfigurationStatus: true,
      dogsConfigurationStatusMessage: true,
      dogs: {
        select: {
          gender: true,
          idNumber: true,
          isCategorized: true,
          isSterilized: true,
        },
      },
      name: true,
      chairCount: true,
      dividerCount: true,
      dividerType: true,
      hasElectricalConnection: true,
      hasTablecloths: true,
      installationDay: true,
      peopleCount: true,
      placementComment: true,
      size: { select: { label: true } },
      standConfigurationStatus: true,
      standConfigurationStatusMessage: true,
      tableCount: true,
      zone: true,
    },
  });

  return { exhibitor };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? ["Stand", data.exhibitor.name] : getErrorTitle(404),
    ),
  });
};

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <FormLayout.Form asChild>
        <div>
          <SectionStandConfiguration />

          <FormLayout.SectionSeparator />

          <SectionDogs />
        </div>
      </FormLayout.Form>

      <SectionHelper />
    </FormLayout.Root>
  );
}
