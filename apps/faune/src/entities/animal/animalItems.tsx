import {
  getAnimalDisplayName,
  SearchableAnimal,
} from "@animeaux/shared-entities";
import { Avatar } from "dataDisplay/avatar";
import { AvatarImage } from "dataDisplay/image";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  LinkItemProps,
} from "dataDisplay/item";
import { Placeholder } from "loaders/placeholder";
import * as React from "react";

export function SearchableAnimalItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <Placeholder preset="avatar" />
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
};

export function SearchableAnimalLinkItem({
  animal,
  ...rest
}: SearchableAnimalLinkItemProps) {
  const displayName = getAnimalDisplayName(animal);

  return (
    <LinkItem {...rest}>
      <ItemIcon>
        <Avatar>
          <AvatarImage image={animal.avatarId} alt={displayName} />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{displayName}</ItemMainText>
      </ItemContent>
    </LinkItem>
  );
}
