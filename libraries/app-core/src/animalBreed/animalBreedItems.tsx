import { AnimalBreed, AnimalSpeciesLabels } from "@animeaux/shared-entities";
import {
  Avatar,
  ButtonItem,
  ButtonItemProps,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
  LinkItemProps,
  Placeholder,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaDna } from "react-icons/fa";

export function AnimalBreedItemPlaceholder() {
  return (
    <Item size="large">
      <ItemIcon size="large">
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

type AnimalBreedItemProps = LinkItemProps & {
  animalBreed: AnimalBreed;
};

export function AnimalBreedItem({
  animalBreed,
  ...rest
}: AnimalBreedItemProps) {
  return (
    <LinkItem {...rest} size="large">
      <ItemIcon size="large">
        <Avatar size="large">
          <FaDna />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{animalBreed.name}</ItemMainText>

        <ItemSecondaryText>
          {AnimalSpeciesLabels[animalBreed.species]}
        </ItemSecondaryText>
      </ItemContent>
    </LinkItem>
  );
}

export function AnimalBreedSearchItemPlaceholder() {
  return (
    <Item size="medium">
      <ItemIcon size="medium">
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

type AnimalBreedSearchItemProps = ButtonItemProps & {
  animalBreed: AnimalBreed;
};

export function AnimalBreedSearchItem({
  animalBreed,
  ...rest
}: AnimalBreedSearchItemProps) {
  return (
    <ButtonItem {...rest} size="medium">
      <ItemIcon size="medium">
        <Avatar size="medium">
          <FaDna />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{animalBreed.name}</ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}
