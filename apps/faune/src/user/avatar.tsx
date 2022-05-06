import { User } from "@animeaux/shared";
import styled from "styled-components";
import { Avatar } from "~/core/dataDisplay/avatar";
import { theme } from "~/styles/theme";

export function UserAvatar({ user }: { user: Pick<User, "displayName"> }) {
  return (
    <UserAvatarElement>{user.displayName[0].toUpperCase()}</UserAvatarElement>
  );
}

const UserAvatarElement = styled(Avatar)`
  color: ${theme.colors.primary[500]};
`;
