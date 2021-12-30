import { AnimalBreed, AnimalSpeciesLabels } from "@animeaux/shared-entities";
import { Avatar, AvatarPlaceholder } from "core/dataDisplay/avatar";
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
} from "core/dataDisplay/item";
import { Placeholder } from "core/loaders/placeholder";
import { FaDna } from "react-icons/fa";

export function AnimalBreedItemPlaceholder() {
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
