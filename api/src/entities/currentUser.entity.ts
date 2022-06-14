import { CurrentUser } from "@animeaux/shared";
import { User } from "@prisma/client";

export function mapCurrentUser(
  user: Pick<User, "id" | "displayName" | "email" | "isDisabled" | "groups">
): CurrentUser {
  return {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    disabled: user.isDisabled,
    groups: user.groups,
  };
}
