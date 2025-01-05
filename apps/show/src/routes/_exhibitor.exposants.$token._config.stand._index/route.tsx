import { getErrorTitle } from "#core/data-display/error-page";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { services } from "#core/services/services.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import { SectionDogs } from "./section-dogs";
import { SectionHelper } from "./section-helper";
import { SectionStandConfiguration } from "./section-stand-configuration";
import { SectionStatus } from "./section-status";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = RouteParamsSchema.parse(params);

  const { standConfiguration, profile } = await promiseHash({
    standConfiguration: services.exhibitor.standConfiguration.getByToken(
      routeParams.token,
      {
        select: {
          chairCount: true,
          dividerCount: true,
          dividerType: true,
          hasElectricalConnection: true,
          hasTablecloths: true,
          installationDay: true,
          peopleCount: true,
          placementComment: true,
          size: true,
          status: true,
          statusMessage: true,
          tableCount: true,
          zone: true,

          presentDogs: {
            select: {
              gender: true,
              idNumber: true,
              isCategorized: true,
              isSterilized: true,
            },
          },
        },
      },
    ),

    profile: services.exhibitor.profile.getByToken(routeParams.token, {
      select: { name: true },
    }),
  });

  return { standConfiguration, profile, token: routeParams.token };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? ["Stand", data.profile.name] : getErrorTitle(404),
    ),
  });
};

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <FormLayout.Form asChild>
        <div>
          <SectionStatus />

          <SectionStandConfiguration />

          <FormLayout.SectionSeparator />

          <SectionDogs />
        </div>
      </FormLayout.Form>

      <SectionHelper />
    </FormLayout.Root>
  );
}
