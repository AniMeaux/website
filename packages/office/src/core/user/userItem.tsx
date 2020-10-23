import { User } from "@animeaux/shared";
import * as React from "react";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemProps,
  ItemSecondaryText,
} from "../../ui/item";
import { UserAvatar } from "../../ui/userAvatar";

type UserItemProps = ItemProps & { user: User };

export function UserItem({ user, ...rest }: UserItemProps) {
  return (
    <Item {...rest} large>
      <ItemIcon>
        <UserAvatar user={user} />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{user.displayName}</ItemMainText>
        <ItemSecondaryText>{user.email}</ItemSecondaryText>
      </ItemContent>
    </Item>
  );
}
