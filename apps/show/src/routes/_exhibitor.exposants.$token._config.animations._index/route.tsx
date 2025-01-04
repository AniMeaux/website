import { getErrorTitle } from "#core/data-display/error-page";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { services } from "#core/services/services.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { SectionHelper } from "./section-helper";
import { SectionOnStage } from "./section-on-stage";
import { SectionOnStand } from "./section-on-stand";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = RouteParamsSchema.parse(params);

  const profile = await services.exhibitor.profile.getByToken(
    routeParams.token,
    {
      select: {
        name: true,
        onStandAnimations: true,
      },
    },
  );

  return { profile, token: routeParams.token };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? ["Animations", data.profile.name] : getErrorTitle(404),
    ),
  });
};

export default function Route() {
  return (
    <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
      <FormLayout.Form asChild>
        <div>
          <SectionOnStage />

          <FormLayout.SectionSeparator />

          <SectionOnStand />
        </div>
      </FormLayout.Form>

      <SectionHelper />
    </FormLayout.Root>
  );
}
