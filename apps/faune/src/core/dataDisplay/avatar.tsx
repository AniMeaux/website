import { User } from "@animeaux/shared-entities";
import styled, { css } from "styled-components/macro";
import { theme } from "styles/theme";

type AvatarProps = React.HTMLAttributes<HTMLSpanElement> & {
  isSmall?: boolean;
};

export function Avatar({ isSmall = false, ...rest }: AvatarProps) {
  return <AvatarElement {...rest} $isSmall={isSmall} />;
}

const SMALL_AVATAR_STYLES = css`
  font-size: 14px;
  line-height: ${theme.typography.lineHeight.monoLine};
`;

const AvatarElement = styled.span<{ $isSmall: boolean }>`
  ${(props) => (props.$isSmall ? SMALL_AVATAR_STYLES : null)};
  position: relative;
  overflow: hidden;
  height: 2em;
  width: 2em;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;

  /* Use a pseudo element to have a background opacity. */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: currentColor;
    opacity: 0.1;
  }
`;

type UserAvatarProps = AvatarProps & {
  user: User;
};

export function UserAvatar({ user, ...rest }: UserAvatarProps) {
  return (
    <UserAvatarElement {...rest}>
      {user.displayName[0].toUpperCase()}
    </UserAvatarElement>
  );
}

const UserAvatarElement = styled(Avatar)`
  color: ${theme.colors.primary[500]};
`;
