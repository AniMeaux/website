import { ErrorPage } from "#core/data-display/error-page";
import { PageBackground } from "#core/layout/page-background";
import { notFound } from "#core/response.server";
import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { ShowExhibitorApplicationStatus } from "@animeaux/prisma";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import { LayoutFooter } from "./footer";
import { LayoutHeader } from "./header";

export async function loader({ params }: LoaderFunctionArgs) {
  if (process.env.FEATURE_FLAG_EXHIBITOR_APPLICATION_ONLINE !== "true") {
    throw notFound();
  }

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const { application, exhibitor } = await promiseHash({
    application: services.application.getByToken(routeParams.token, {
      select: { status: true },
    }),

    exhibitor: services.exhibitor.getByToken(routeParams.token, {
      select: { name: true, token: true },
    }),
  });

  // Only validated applications can access these pages.
  if (application.status !== ShowExhibitorApplicationStatus.VALIDATED) {
    throw notFound();
  }

  return { exhibitor };
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return (
    <>
      <PageBackground />

      <LayoutHeader />
      <Outlet />
      <LayoutFooter />
    </>
  );
}
