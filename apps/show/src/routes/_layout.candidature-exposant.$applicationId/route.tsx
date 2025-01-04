import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server";
import { services } from "#core/services/services.server";
import { zu } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { SectionInformation } from "./section-information";
import { SectionTitle } from "./section-title";

export async function loader({ params }: LoaderFunctionArgs) {
  if (process.env.FEATURE_FLAG_EXHIBITOR_APPLICATION_ONLINE !== "true") {
    throw notFound();
  }

  const routeParams = RouteParamsSchema.parse(params);

  const application = await services.exhibitor.application.get(
    routeParams.applicationId,
    { select: { contactEmail: true } },
  );

  return { application };
}

const RouteParamsSchema = zu.object({
  applicationId: zu.string().uuid(),
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? "Candidature exposant" : getErrorTitle(404),
    ),
  });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return (
    <>
      <SectionTitle />
      <SectionInformation />
    </>
  );
}
