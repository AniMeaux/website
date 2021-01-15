import { User } from "@animeaux/shared-entities";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemProps,
  ItemSecondaryText,
  LinkItem,
  LinkItemProps,
  Placeholder,
  UserAvatar,
} from "@animeaux/ui-library";
import * as React from "react";

export function UserItemPlaceholder() {
  return (
    <Item size="large">
      <ItemIcon>
        <Placeholder preset="avatar" />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder preset="label" />
        </ItemMainText>

        <ItemSecondaryText>
          <Placeholder preset="text" className="text-xs" />
        </ItemSecondaryText>
      </ItemContent>
    </Item>
  );
}

type UserItemContentProp = { user: User };

function UserItemContent({ user }: UserItemContentProp) {
  return (
    <>
      <ItemIcon>
        <UserAvatar user={user} />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{user.displayName}</ItemMainText>
        <ItemSecondaryText>{user.email}</ItemSecondaryText>
      </ItemContent>
    </>
  );
}

type UserItemProps = ItemProps & UserItemContentProp;

export function UserItem({ user, ...rest }: UserItemProps) {
  return (
    <Item {...rest} size="large">
      <UserItemContent user={user} />
    </Item>
  );
}

type UserLinkItemProps = LinkItemProps & UserItemContentProp;

export function UserLinkItem({ user, active, ...rest }: UserLinkItemProps) {
  return (
    <LinkItem {...rest} size="large" active={active} disabled={user.disabled}>
      <UserItemContent user={user} />
    </LinkItem>
  );
}
