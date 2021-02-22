import {
  getAnimalDisplayName,
  SearchableAnimal,
} from "@animeaux/shared-entities";
import {
  Avatar,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  LinkItemProps,
  Placeholder,
} from "@animeaux/ui-library";
import * as React from "react";
import { getAnimalAvatarUrl } from "./animalPictures";

export function SearchableAnimalItemPlaceholder() {
  return (
    <Item size="large">
      <ItemIcon size="large">
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

type SearchableAnimalItemProps = LinkItemProps & {
  animal: SearchableAnimal;
};

export function SearchableAnimalItem({
  animal,
  ...rest
}: SearchableAnimalItemProps) {
  const displayName = getAnimalDisplayName(animal);

  return (
    <LinkItem {...rest} size="large">
      <ItemIcon size="large">
        <Avatar size="large">
          <img src={getAnimalAvatarUrl(animal)} alt={displayName} />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{displayName}</ItemMainText>
      </ItemContent>
    </LinkItem>
  );
}
