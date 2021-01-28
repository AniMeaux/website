import { AnimalBreed, AnimalSpeciesLabels } from "@animeaux/shared-entities";
import {
  Avatar,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
  LinkItemProps,
  Placeholder
} from "@animeaux/ui-library";
import * as React from "react";
import { FaTag } from "react-icons/fa";

export function AnimalBreedItemPlaceholder() {
  return (
    <Item size="large">
      <ItemIcon>
        <Placeholder preset="avatar" />
      </ItemIcon>

      <ItemContent>
        <Placeholder preset="label" />
        <Placeholder preset="text" className="text-xs" />
      </ItemContent>
    </Item>
  );
}

type AnimalBreedItemProps = LinkItemProps & {
  animalBreed: AnimalBreed;
};

export function AnimalBreedItem({
  animalBreed,
  active,
  ...rest
}: AnimalBreedItemProps) {
  return (
    <LinkItem {...rest} size="large" active={active}>
      <ItemIcon>
        <Avatar>
          <FaTag />
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
