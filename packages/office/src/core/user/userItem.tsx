import { User } from "@animeaux/shared-entities";
import * as React from "react";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemProps,
  ItemSecondaryText,
  LinkItem,
  LinkItemProps,
} from "../../ui/item";
import { UserAvatar } from "../../ui/userAvatar";

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

type UserLinkItemProps = Omit<LinkItemProps, "href"> & UserItemContentProp;

export function UserLinkItem({ user, active, ...rest }: UserLinkItemProps) {
  return (
    <LinkItem
      {...rest}
      size="large"
      href={active ? "/menu/users" : `/menu/users/${user.id}`}
      active={active}
      disabled={user.disabled}
    >
      <UserItemContent user={user} />
    </LinkItem>
  );
}
