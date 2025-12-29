import type { User } from "@animeaux/prisma";
import { setUser } from "@sentry/remix";

export function useCurrentUserForMonitoring(
  currentUser: null | Pick<User, "displayName" | "email" | "groups" | "id">,
) {
  // Do this as early as possible for possible errors during rendering.
  if (currentUser == null) {
    setUser(null);
    return;
  }

  setUser({
    id: currentUser.id,
    username: currentUser.displayName,
    email: currentUser.email,
    groups: currentUser.groups,
  });
}
