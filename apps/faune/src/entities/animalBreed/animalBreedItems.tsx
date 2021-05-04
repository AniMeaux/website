import { AnimalBreed, AnimalSpeciesLabels } from "@animeaux/shared-entities";
import * as React from "react";
import { FaDna } from "react-icons/fa";
import { Avatar } from "ui/dataDisplay/avatar";
import {
  ButtonItem,
  ButtonItemProps,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
  LinkItemProps,
} from "ui/dataDisplay/item";
import { Placeholder } from "ui/loaders/placeholder";

export function AnimalBreedItemPlaceholder() {
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

type AnimalBreedItemProps = {
  animalBreed: AnimalBreed;
};

type AnimalBreedLinkItemProps = LinkItemProps & AnimalBreedItemProps;

export function AnimalBreedLinkItem({
  animalBreed,
  ...rest
}: AnimalBreedLinkItemProps) {
  return (
    <LinkItem {...rest}>
      <ItemIcon>
        <Avatar>
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

type AnimalBreedButtonItemProps = ButtonItemProps & AnimalBreedItemProps;

export function AnimalBreedButtonItem({
  animalBreed,
  ...rest
}: AnimalBreedButtonItemProps) {
  return (
    <ButtonItem {...rest}>
      <ItemIcon>
        <Avatar>
          <FaDna />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{animalBreed.name}</ItemMainText>

        <ItemSecondaryText>
          {AnimalSpeciesLabels[animalBreed.species]}
        </ItemSecondaryText>
      </ItemContent>
    </ButtonItem>
  );
}
