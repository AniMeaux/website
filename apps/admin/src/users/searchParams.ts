import { UserGroup } from "@prisma/client";
import { z } from "zod";
import { ensureBoolean, parseOrDefault } from "~/core/schemas";

export class UserSearchParams extends URLSearchParams {
  static readonly Keys = {
    DISPLAY_NAME: "q",
    GROUP: "group",
    IS_DISABLED: "disabled",
  };

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

  getIsDisabled() {
    return parseOrDefault(
      z.preprocess(
        ensureBoolean,
        z.boolean().nullable().optional().default(null)
      ),
      this.get(UserSearchParams.Keys.IS_DISABLED)
    );
  }

  setIsDisabled(isDisabled: null | boolean) {
    const copy = new UserSearchParams(this);

    if (isDisabled != null) {
      copy.set(UserSearchParams.Keys.IS_DISABLED, String(isDisabled));
    } else if (copy.has(UserSearchParams.Keys.IS_DISABLED)) {
      copy.delete(UserSearchParams.Keys.IS_DISABLED);
    }

    return copy;
  }
}
