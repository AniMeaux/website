import { User } from "@animeaux/shared-entities";
import { AvatarPlaceholder } from "core/dataDisplay/avatar";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemProps,
  ItemSecondaryText,
} from "core/dataDisplay/item";
import { Placeholder } from "core/loaders/placeholder";
import { UserAvatar } from "user/avatar";

export function UserItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <AvatarPlaceholder />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder $preset="label" />
        </ItemMainText>

        <ItemSecondaryText>
          <Placeholder $preset="text" />
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
