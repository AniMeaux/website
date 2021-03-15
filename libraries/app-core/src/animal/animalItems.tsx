import {
  getAnimalDisplayName,
  SearchableAnimal,
} from "@animeaux/shared-entities";
import {
  Avatar,
  Image,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemProps,
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

type SearchableAnimalContentProps = {
  animal: SearchableAnimal;
};

function SearchableAnimalContent({ animal }: SearchableAnimalContentProps) {
  const displayName = getAnimalDisplayName(animal);

  return (
    <>
      <ItemIcon>
        <Avatar size="large">
          <Image image={animal.avatarId} preset="avatar" alt={displayName} />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{displayName}</ItemMainText>
      </ItemContent>
    </>
  );
}

type SearchableAnimalLinkItemProps = LinkItemProps &
  SearchableAnimalContentProps;

export function SearchableAnimalLinkItem({
  animal,
  ...rest
}: SearchableAnimalLinkItemProps) {
  return (
    <LinkItem {...rest}>
      <SearchableAnimalContent animal={animal} />
    </LinkItem>
  );
}

type SearchableAnimalItemProps = ItemProps & SearchableAnimalContentProps;

export function SearchableAnimalItem({
  animal,
  ...rest
}: SearchableAnimalItemProps) {
  return (
    <Item {...rest}>
      <SearchableAnimalContent animal={animal} />
    </Item>
  );
}
