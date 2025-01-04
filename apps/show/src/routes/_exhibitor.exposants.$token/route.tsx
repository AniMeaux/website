import { ErrorPage } from "#core/data-display/error-page";
import { PageBackground } from "#core/layout/page-background";
import { notFound } from "#core/response.server";
import { services } from "#core/services/services.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { ShowExhibitorApplicationStatus } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import { ExhibitorFooter } from "./footer";
import { ExhibitorHeader } from "./header";

export async function loader({ params }: LoaderFunctionArgs) {
  if (process.env.FEATURE_FLAG_EXHIBITOR_APPLICATION_ONLINE !== "true") {
    throw notFound();
  }

  const routeParams = RouteParamsSchema.parse(params);

  const { application, profile } = await promiseHash({
    application: services.exhibitor.application.getByToken(routeParams.token, {
      select: { status: true },
    }),

    profile: services.exhibitor.profile.getByToken(routeParams.token, {
      select: { name: true },
    }),
  });

  // Only validated applications can access these pages.
  if (application.status !== ShowExhibitorApplicationStatus.VALIDATED) {
    throw notFound();
  }

  return { profile, token: routeParams.token };
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return (
    <>
      <PageBackground />

      <ExhibitorHeader />
      <Outlet />
      <ExhibitorFooter />
    </>
  );
}
