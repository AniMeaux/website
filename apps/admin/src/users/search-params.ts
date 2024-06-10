import { endOfDay } from "#core/dates";
import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import { DateTime } from "luxon";

export enum UserSort {
  LAST_ACTIVITY = "L",
  NAME = "N",
}

export const USER_DEFAULT_SORT = UserSort.NAME;

export const UserSearchParams = SearchParamsIO.create({
  keys: {
    displayName: "q",
    groups: "group",
    lastActivityEnd: "lae",
    lastActivityStart: "las",
    noActivity: "na",
    sort: "sort",
  },

  parseFunction: (searchParams, keys) => {
    return Schema.parse({
      displayName: searchParams.get(keys.displayName),
      groups: searchParams.getAll(keys.groups),
      lastActivityEnd: searchParams.get(keys.lastActivityEnd),
      lastActivityStart: searchParams.get(keys.lastActivityStart),
      noActivity: searchParams.get(keys.noActivity),
      sort: searchParams.get(keys.sort) ?? undefined,
    });
  },

  setFunction: (searchParams, data, keys) => {
    if (data.displayName == null) {
      searchParams.delete(keys.displayName);
    } else {
      searchParams.set(keys.displayName, data.displayName);
    }

    searchParams.delete(keys.groups);
    data.groups?.forEach((group) => {
      searchParams.append(keys.groups, group);
    });

    if (data.lastActivityEnd == null) {
      searchParams.delete(keys.lastActivityEnd);
    } else {
      searchParams.set(
        keys.lastActivityEnd,
        DateTime.fromJSDate(data.lastActivityEnd).toISODate(),
      );
    }

    if (data.lastActivityStart == null) {
      searchParams.delete(keys.lastActivityStart);
    } else {
      searchParams.set(
        keys.lastActivityStart,
        DateTime.fromJSDate(data.lastActivityStart).toISODate(),
      );
    }

    if (data.noActivity == null || !data.noActivity) {
      searchParams.delete(keys.noActivity);
    } else {
      searchParams.set(keys.noActivity, "on");
    }

    if (data.sort == null || data.sort === USER_DEFAULT_SORT) {
      searchParams.delete(keys.sort);
    } else {
      searchParams.set(keys.sort, data.sort);
    }
  },
});

const Schema = zu.object({
  displayName: zu.searchParams.string(),
  groups: zu.searchParams.set(zu.searchParams.nativeEnum(UserGroup)),
  lastActivityEnd: zu.searchParams.date().transform(endOfDay),
  lastActivityStart: zu.searchParams.date(),
  noActivity: zu.searchParams.boolean(),
  sort: zu.searchParams.nativeEnum(UserSort).default(USER_DEFAULT_SORT),
});
