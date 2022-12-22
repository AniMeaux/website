import { ensureBoolean, parseOrDefault } from "#/core/schemas";
import { UserGroup } from "@prisma/client";
import { z } from "zod";

enum Keys {
  TEXT = "q",
  GROUP = "group",
  IS_DISABLED = "disabled",
}

export class UserSearchParams extends URLSearchParams {
  static readonly Keys = Keys;

  getText() {
    return this.get(Keys.TEXT) || null;
  }

  setText(text: string) {
    const copy = new UserSearchParams(this);

    if (text !== "") {
      copy.set(Keys.TEXT, text);
    } else if (copy.has(Keys.TEXT)) {
      copy.delete(Keys.TEXT);
    }

    return copy;
  }

  getGroup() {
    return parseOrDefault(
      z.nativeEnum(UserGroup).nullable().optional().default(null),
      this.get(Keys.GROUP)
    );
  }

  setGroup(group: UserGroup | null) {
    const copy = new UserSearchParams(this);

    if (group != null) {
      copy.set(Keys.GROUP, group);
    } else if (copy.has(Keys.GROUP)) {
      copy.delete(Keys.GROUP);
    }

    return copy;
  }

  getIsDisabled() {
    return parseOrDefault(
      z.preprocess(
        ensureBoolean,
        z.boolean().nullable().optional().default(null)
      ),
      this.get(Keys.IS_DISABLED)
    );
  }

  setIsDisabled(isDisabled: null | boolean) {
    const copy = new UserSearchParams(this);

    if (isDisabled != null) {
      copy.set(Keys.IS_DISABLED, String(isDisabled));
    } else if (copy.has(Keys.IS_DISABLED)) {
      copy.delete(Keys.IS_DISABLED);
    }

    return copy;
  }
}
