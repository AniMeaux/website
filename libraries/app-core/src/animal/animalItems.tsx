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
  PlaceholderPreset,
} from "@animeaux/ui-library";
import * as React from "react";

type SearchableAnimalItemPlaceholderProps = {
  size?: AvatarSize;
};

const SearchableAnimalItemPlaceholderSize: {
  [key in AvatarSize]: PlaceholderPreset;
} = {
  small: "avatar-small",
  medium: "avatar",
  large: "avatar-large",
  display: "avatar-display",
};

export function SearchableAnimalItemPlaceholder({
  size = "large",
}: SearchableAnimalItemPlaceholderProps) {
  return (
    <Item>
      <ItemIcon>
        <Placeholder preset={SearchableAnimalItemPlaceholderSize[size]} />
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
  size?: AvatarSize;
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
