import { CurrentUser, UserGroup } from "@animeaux/shared";
import { useCurrentUser } from "account/currentUser";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import { useLayoutEffect } from "react";

function getUserMainGroup(user: CurrentUser): UserGroup {
  if (user.groups.includes(UserGroup.ADMIN)) {
    return UserGroup.ADMIN;
  }

  if (user.groups.includes(UserGroup.ANIMAL_MANAGER)) {
    return UserGroup.ANIMAL_MANAGER;
  }

  if (user.groups.includes(UserGroup.VETERINARIAN)) {
    return UserGroup.VETERINARIAN;
  }

  if (user.groups.includes(UserGroup.BLOGGER)) {
    return UserGroup.BLOGGER;
  }

  return UserGroup.HEAD_OF_PARTNERSHIPS;
}

const UserGroupLandingPage: Record<UserGroup, string> = {
  [UserGroup.ADMIN]: "/animals",
  [UserGroup.ANIMAL_MANAGER]: "/animals",
  [UserGroup.BLOGGER]: "/articles",
  [UserGroup.HEAD_OF_PARTNERSHIPS]: "/partners",
  [UserGroup.VETERINARIAN]: "/animals",
};

const IndexPage: PageComponent = () => {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const path = UserGroupLandingPage[getUserMainGroup(currentUser)];

  useLayoutEffect(() => {
    router.replace(path);
  }, [router, path]);

  return null;
};

export default IndexPage;
