import {
  getAnimalDisplayName,
  SearchableAnimal,
} from "@animeaux/shared-entities";
import {
  Avatar,
  AvatarSize,
  Image,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  LinkItemProps,
  Placeholder,
} from "@animeaux/ui-library";
import * as React from "react";

export function SearchableAnimalItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <Placeholder preset="avatar-large" />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder preset="label" />
        </ItemMainText>
      </ItemContent>
    </Item>
  );
}

type SearchableAnimalLinkItemProps = LinkItemProps & {
  animal: SearchableAnimal;
  size?: AvatarSize | undefined;
};

export function SearchableAnimalLinkItem({
  animal,
  size = "large",
  ...rest
}: SearchableAnimalLinkItemProps) {
  const displayName = getAnimalDisplayName(animal);

  return (
    <LinkItem {...rest}>
      <ItemIcon>
        <Avatar size={size}>
          <Image image={animal.avatarId} preset="avatar" alt={displayName} />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{displayName}</ItemMainText>
      </ItemContent>
    </LinkItem>
  );
}
