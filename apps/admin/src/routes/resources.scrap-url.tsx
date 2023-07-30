import { UserGroup } from "@prisma/client";
import { json, LoaderArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { createPath } from "history";
import { DateTime } from "luxon";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { db } from "~/core/db.server";
import { scrapUrl } from "~/core/metascraper.server";
import { BadRequestResponse } from "~/core/response.server";
import { parseOrDefault } from "~/core/schemas";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";

const RESOURCE_PATHNAME = "/resources/scrap-url";

export class ScrapUrlSearchParams extends URLSearchParams {
  static readonly Keys = {
    URL: "url",
  };

  getUrl() {
    return parseOrDefault(
      z.string().url().optional(),
      this.get(ScrapUrlSearchParams.Keys.URL)
    );
  }

  setUrl(url: string) {
    const copy = new ScrapUrlSearchParams(this);

    if (url !== "") {
      copy.set(ScrapUrlSearchParams.Keys.URL, url);
    } else {
      copy.delete(ScrapUrlSearchParams.Keys.URL);
    }

    return copy;
  }
}

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new ScrapUrlSearchParams(
    new URL(request.url).searchParams
  );
  const url = searchParams.getUrl();
  if (url == null) {
    throw new BadRequestResponse();
  }

  const response = await fetch(url);
  const html = await response.text();
  const result = await scrapUrl({ url, html });

  return json({
    image: result.image || undefined,
    publisherName: result.publisher?.trim() || new URL(url).hostname,
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
            pathname: RESOURCE_PATHNAME,
            search: new ScrapUrlSearchParams().setUrl(result.data).toString(),
          })
        );
      }
    }
  }, [url, isEnabled, load]);

  return useMemo(() => ({ data, state }), [data, state]);
}
