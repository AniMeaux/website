import { PageLayout } from "#i/core/layout/page.js";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./loader.server";

export function Header() {
  const { activity } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Header.Root>
      <PageLayout.Header.Title>
        Activité du{" "}
        {DateTime.fromISO(activity.createdAt).toLocaleString(
          DateTime.DATETIME_MED,
        )}
      </PageLayout.Header.Title>
    </PageLayout.Header.Root>
  );
}
