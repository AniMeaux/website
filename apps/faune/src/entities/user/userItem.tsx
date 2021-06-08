import { User } from "@animeaux/shared-entities";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemProps,
  ItemSecondaryText,
} from "dataDisplay/item";
import { UserAvatar } from "entities/user/userAvatar";
import { Placeholder } from "loaders/placeholder";
import * as React from "react";

export function UserItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <Placeholder preset="avatar" />
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

type UserItemProps = ItemProps & { user: User };
export function UserItem({ user, ...rest }: UserItemProps) {
  return (
    <Item {...rest}>
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
