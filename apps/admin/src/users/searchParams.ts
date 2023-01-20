import { UserGroup } from "@prisma/client";
import isEqual from "lodash.isequal";
import orderBy from "lodash.orderby";
import { DateTime } from "luxon";
import { z } from "zod";
import { ensureBoolean, ensureDate, parseOrDefault } from "~/core/schemas";

export class UserSearchParams extends URLSearchParams {
  static readonly Sort = {
    LAST_ACTIVITY: "LAST_ACTIVITY",
    NAME: "NAME",
    RELEVANCE: "RELEVANCE",
  } as const;

  static readonly Keys = {
    DISPLAY_NAME: "q",
    GROUP: "group",
    MAX_ACTIVITY: "maxActivity",
    MIN_ACTIVITY: "minActivity",
    NO_ACTIVITY: "noActivity",
    SORT: "sort",
  };

  isEmpty() {
    return this.areFiltersEqual(new UserSearchParams());
  }

  areFiltersEqual(other: UserSearchParams) {
    return (
      isEqual(this.getDisplayName(), other.getDisplayName()) &&
      isEqual(orderBy(this.getGroups()), orderBy(other.getGroups())) &&
      isEqual(this.getMaxActivity(), other.getMaxActivity()) &&
      isEqual(this.getMinActivity(), other.getMinActivity()) &&
      isEqual(this.getNoActivity(), other.getNoActivity())
    );
  }

  getSort() {
    return parseOrDefault(
      z
        .nativeEnum(UserSearchParams.Sort)
        .default(UserSearchParams.Sort.RELEVANCE),
      this.get(UserSearchParams.Keys.SORT)
    );
  }

  getDisplayName() {
    return this.get(UserSearchParams.Keys.DISPLAY_NAME)?.trim() || null;
  }

  setDisplayName(displayName: string) {
    const copy = new UserSearchParams(this);

    displayName = displayName.trim();
    if (displayName !== "") {
      copy.set(UserSearchParams.Keys.DISPLAY_NAME, displayName);
    } else if (copy.has(UserSearchParams.Keys.DISPLAY_NAME)) {
      copy.delete(UserSearchParams.Keys.DISPLAY_NAME);
    }

    return copy;
  }

  deleteDisplayName() {
    const copy = new UserSearchParams(this);
    copy.delete(UserSearchParams.Keys.DISPLAY_NAME);
    return copy;
  }

  getGroups() {
    return parseOrDefault(
      z.nativeEnum(UserGroup).array().default([]),
      this.getAll(UserSearchParams.Keys.GROUP)
    );
  }

  setGroups(groups: UserGroup[]) {
    const copy = new UserSearchParams(this);
    copy.delete(UserSearchParams.Keys.GROUP);
    groups.forEach((group) => {
      copy.append(UserSearchParams.Keys.GROUP, group);
    });

    return copy;
  }

  getMinActivity() {
    const date = parseOrDefault(
      z.preprocess(ensureDate, z.date()).optional(),
      this.get(UserSearchParams.Keys.MIN_ACTIVITY)
    );

    if (date == null) {
      return null;
    }

    return DateTime.fromJSDate(date).startOf("day").toJSDate();
  }

  deleteMinActivity() {
    const copy = new UserSearchParams(this);
    copy.delete(UserSearchParams.Keys.MIN_ACTIVITY);
    return copy;
  }

  getMaxActivity() {
    const date = parseOrDefault(
      z.preprocess(ensureDate, z.date()).optional(),
      this.get(UserSearchParams.Keys.MAX_ACTIVITY)
    );

    if (date == null) {
      return null;
    }

    return DateTime.fromJSDate(date).startOf("day").toJSDate();
  }

  deleteMaxActivity() {
    const copy = new UserSearchParams(this);
    copy.delete(UserSearchParams.Keys.MAX_ACTIVITY);
    return copy;
  }

  getNoActivity() {
    return parseOrDefault(
      z.preprocess(ensureBoolean, z.boolean()).default(false),
      this.get(UserSearchParams.Keys.NO_ACTIVITY)
    );
  }
}
