import { PageComponent, useCurrentUser } from "@animeaux/app-core";
import { User, UserGroup } from "@animeaux/shared-entities";
import { useRouter } from "@animeaux/ui-library";
import * as React from "react";

function getUserMainGroup(user: User): UserGroup {
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

const UserGroupLandingPage: { [key in UserGroup]: string } = {
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

  React.useLayoutEffect(() => {
    router.replace(path);
  }, [router, path]);

  return null;
};

export default IndexPage;
