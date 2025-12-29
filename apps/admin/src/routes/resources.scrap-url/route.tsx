import { db } from "#core/db.server";
import { scrapUrl } from "#core/metascraper.server";
import { badRequest } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { UserGroup } from "@animeaux/prisma";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { DateTime } from "luxon";
import { ScrapUrlSearchParams } from "./shared";

export type loader = typeof loader;

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = ScrapUrlSearchParams.parse(
    new URL(request.url).searchParams,
  );

  if (searchParams.url == null) {
    throw badRequest();
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
