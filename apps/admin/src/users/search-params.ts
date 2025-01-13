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

  parseFunction: ({ keys, getValue, getValues }) => {
    return Schema.parse({
      displayName: getValue(keys.displayName),
      groups: getValues(keys.groups),
      lastActivityEnd: getValue(keys.lastActivityEnd),
      lastActivityStart: getValue(keys.lastActivityStart),
      noActivity: getValue(keys.noActivity),
      sort: getValue(keys.sort),
    });
  },

  setFunction: (data, { keys, setValue, setValues }) => {
    setValue(keys.displayName, data.displayName);
    setValues(keys.groups, data.groups);

    setValue(
      keys.lastActivityEnd,
      data.lastActivityEnd == null
        ? undefined
        : DateTime.fromJSDate(data.lastActivityEnd).toISODate(),
    );

    setValue(
      keys.lastActivityStart,
      data.lastActivityStart == null
        ? undefined
        : DateTime.fromJSDate(data.lastActivityStart).toISODate(),
    );

    setValue(keys.noActivity, data.noActivity ? "on" : undefined);

    setValue(
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
