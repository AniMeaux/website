import { getErrorTitle } from "#core/data-display/error-page";
import { FormLayout } from "#core/layout/form-layout";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server.js";
import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import { SectionHelper } from "./section-helper";
import { SectionOnStage } from "./section-on-stage";
import { SectionOnStand } from "./section-on-stand";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const { exhibitor, animations } = await promiseHash({
    exhibitor: services.exhibitor.getByToken(routeParams.token, {
      select: {
        id: true,
        token: true,
        name: true,
        onStandAnimations: true,
        onStandAnimationsStatus: true,
        onStandAnimationsStatusMessage: true,
      },
    }),

    animations: services.animation.getManyVisibleByToken(routeParams.token, {
      select: {
        animators: {
          where: { isVisible: true },
          orderBy: { name: "asc" },
          select: { id: true, links: true, name: true },
        },
        description: true,
        endTime: true,
        id: true,
        registrationUrl: true,
        startTime: true,
        targets: true,
        zone: true,
      },
    }),
  });

  return {
    exhibitor,

    animations: animations.map((animation) => ({
      ...animation,

      animators: animation.animators.map(({ links, ...animator }) => {
        const url = links[0];

        if (url == null) {
          throw notFound();
        }

        return { ...animator, url };
      }),
    })),
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? ["Animations", data.exhibitor.name] : getErrorTitle(404),
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
