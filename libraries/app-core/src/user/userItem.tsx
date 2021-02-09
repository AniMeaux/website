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
} from "@animeaux/ui-library";
import * as React from "react";
import { UserAvatar } from "./userAvatar";

export function UserItemPlaceholder() {
  return (
    <Item size="large">
      <ItemIcon size="large">
        <Placeholder preset="avatar-large" />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder preset="label" />
        </ItemMainText>

        <ItemSecondaryText>
          <Placeholder preset="text" />
        </ItemSecondaryText>
      </ItemContent>
    </Item>
  );
}

type UserItemContentProp = { user: User };

function UserItemContent({ user }: UserItemContentProp) {
  return (
    <>
      <ItemIcon size="large">
        <UserAvatar user={user} size="large" />
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

export function UserLinkItem({ user, ...rest }: UserLinkItemProps) {
  return (
    <LinkItem {...rest} size="large">
      <UserItemContent user={user} />
    </LinkItem>
  );
}
