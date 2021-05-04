import { User } from "@animeaux/shared-entities";
import { UserAvatar } from "entities/user/userAvatar";
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
} from "ui/dataDisplay/item";
import { Placeholder } from "ui/loaders/placeholder";

export function UserItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
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
    <Item {...rest}>
      <UserItemContent user={user} />
    </Item>
  );
}

type UserLinkItemProps = LinkItemProps & UserItemContentProp;
export function UserLinkItem({ user, ...rest }: UserLinkItemProps) {
  return (
    <LinkItem {...rest}>
      <UserItemContent user={user} />
    </LinkItem>
  );
}
