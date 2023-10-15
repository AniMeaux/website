import { endOfDay } from "#core/dates.ts";
import { SearchParamsDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";

export enum UserSort {
  LAST_ACTIVITY = "L",
  NAME = "N",
}

export const USER_DEFAULT_SORT = UserSort.NAME;

export const UserSearchParams = SearchParamsDelegate.create({
  displayName: {
    key: "q",
    schema: zu.searchParams.string(),
  },
  groups: {
    key: "group",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(UserGroup)),
  },
  lastActivityEnd: {
    key: "lae",
    schema: zu.searchParams.date().transform(endOfDay),
  },
  lastActivityStart: {
    key: "las",
    schema: zu.searchParams.date(),
  },
  noActivity: {
    key: "na",
    schema: zu.searchParams.boolean(),
  },
  sort: zu.searchParams.nativeEnum(UserSort).default(USER_DEFAULT_SORT),
});
