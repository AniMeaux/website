import { db } from "#core/db.server.ts";
import { scrapUrl } from "#core/metascraper.server.ts";
import { Routes } from "#core/navigation.ts";
import { BadRequestResponse } from "#core/response.server.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { SearchParamsDelegate, zsp } from "@animeaux/form-data";
import { UserGroup } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { createPath } from "history";
import { DateTime } from "luxon";
import { useEffect, useMemo } from "react";
import { z } from "zod";

const ScrapUrlSearchParams = SearchParamsDelegate.create({
  url: zsp.text(z.string().url()),
});

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = ScrapUrlSearchParams.parse(
    new URL(request.url).searchParams,
  );

  if (searchParams.url == null) {
    throw new BadRequestResponse();
  }

  const response = await fetch(searchParams.url);
  const html = await response.text();
  const result = await scrapUrl({ url: searchParams.url, html });

  return json({
    image: result.image || undefined,
    publisherName:
      result.publisher?.trim() || new URL(searchParams.url).hostname,
    publicationDate:
      result.date == null
        ? undefined
        : DateTime.fromISO(result.date).startOf("day").toISODate(),
    title: result.title?.trim() || undefined,
  });
}

export function useScrapUrlFetcher({
  url,
  isEnabled,
}: {
  url: string;
  isEnabled: boolean;
}) {
  const { load, data, state } = useFetcher<typeof loader>();

  useEffect(() => {
    if (isEnabled) {
      const result = z.string().url().safeParse(url);
      if (result.success) {
        load(
          createPath({
            pathname: Routes.resources.scrapUrl.toString(),
            search: ScrapUrlSearchParams.stringify({ url: result.data }),
          }),
        );
      }
    }
  }, [url, isEnabled, load]);

  return useMemo(() => ({ data, state }), [data, state]);
}
