import { User } from "@animeaux/shared";
import { Avatar } from "core/dataDisplay/avatar";
import styled from "styled-components";
import { theme } from "styles/theme";

type UserAvatarProps = {
  user: Pick<User, "displayName">;
};

export function UserAvatar({ user }: UserAvatarProps) {
  return (
    <UserAvatarElement>{user.displayName[0].toUpperCase()}</UserAvatarElement>
  );
}

const UserAvatarElement = styled(Avatar)`
  color: ${theme.colors.primary[500]};
`;
