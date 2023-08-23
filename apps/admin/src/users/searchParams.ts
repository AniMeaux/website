import { endOfDay, startOfDay } from "#core/dates.ts";
import { zsp } from "#core/schemas.tsx";
import { createSearchParams } from "#core/searchParams.ts";
import { UserGroup } from "@prisma/client";
import { z } from "zod";

export enum UserSort {
  LAST_ACTIVITY = "L",
  NAME = "N",
}

export const USER_DEFAULT_SORT = UserSort.NAME;

export const UserSearchParams = createSearchParams({
  displayName: { key: "q", schema: zsp.text() },
  groups: {
    key: "group",
    schema: zsp.set(z.nativeEnum(UserGroup)),
  },
  lastActivityEnd: { key: "lae", schema: zsp.date(endOfDay) },
  lastActivityStart: { key: "las", schema: zsp.date(startOfDay) },
  noActivity: { key: "na", schema: zsp.checkbox() },
  sort: zsp.requiredEnum(UserSort, USER_DEFAULT_SORT),
});
