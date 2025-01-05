import { getErrorTitle } from "#core/data-display/error-page";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { services } from "#core/services/services.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { SectionDescription } from "./section-description";
import { SectionHelper } from "./section-helper";
import { SectionPublicProfile } from "./section-public-profile";
import { SectionStatus } from "./section-status";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = RouteParamsSchema.parse(params);

  const profile = await services.exhibitor.profile.getByToken(
    routeParams.token,
    {
      select: {
        updatedAt: true,
        activityFields: true,
        activityTargets: true,
        description: true,
        links: true,
        logoPath: true,
        name: true,
      },
    },
  );

  return { profile, token: routeParams.token };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? ["Profil", data.profile.name] : getErrorTitle(404),
    ),
  });
};

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <FormLayout.Form asChild>
        <div>
          <SectionStatus />
          <SectionPublicProfile />
          <FormLayout.SectionSeparator />
          <SectionDescription />
        </div>
      </FormLayout.Form>

      <SectionHelper />
    </FormLayout.Root>
  );
}
