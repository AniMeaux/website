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
      displayName: SearchParamsIO.getValue(searchParams, keys.displayName),
      groups: SearchParamsIO.getValues(searchParams, keys.groups),
      lastActivityEnd: SearchParamsIO.getValue(
        searchParams,
        keys.lastActivityEnd,
      ),
      lastActivityStart: SearchParamsIO.getValue(
        searchParams,
        keys.lastActivityStart,
      ),
      noActivity: SearchParamsIO.getValue(searchParams, keys.noActivity),
      sort: SearchParamsIO.getValue(searchParams, keys.sort),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValue(searchParams, keys.displayName, data.displayName);

    SearchParamsIO.setValues(searchParams, keys.groups, data.groups);

    SearchParamsIO.setValue(
      searchParams,
      keys.lastActivityEnd,
      data.lastActivityEnd == null
        ? undefined
        : DateTime.fromJSDate(data.lastActivityEnd).toISODate(),
    );

    SearchParamsIO.setValue(
      searchParams,
      keys.lastActivityStart,
      data.lastActivityStart == null
        ? undefined
        : DateTime.fromJSDate(data.lastActivityStart).toISODate(),
    );

    SearchParamsIO.setValue(
      searchParams,
      keys.noActivity,
      data.noActivity ? "on" : undefined,
    );

    SearchParamsIO.setValue(
      searchParams,
      keys.sort,
      data.sort === USER_DEFAULT_SORT ? undefined : data.sort,
    );
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
