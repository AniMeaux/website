import { AnimalBreed, AnimalSpeciesLabels } from "@animeaux/shared-entities";
import {
  Avatar,
  AvatarSize,
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
  PlaceholderPreset,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaDna } from "react-icons/fa";

type AnimalBreedItemPlaceholderProps = {
  size?: AvatarSize;
};

const AnimalBreedItemPlaceholderSize: {
  [key in AvatarSize]: PlaceholderPreset;
} = {
  small: "avatar-small",
  medium: "avatar",
  large: "avatar-large",
  display: "avatar-display",
};

function isLarge(size: AvatarSize) {
  return size === "large" || size === "display";
}

export function AnimalBreedItemPlaceholder({
  size = "large",
}: AnimalBreedItemPlaceholderProps) {
  return (
    <Item>
      <ItemIcon>
        <Placeholder preset={AnimalBreedItemPlaceholderSize[size]} />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder preset="label" />
        </ItemMainText>

        {isLarge(size) && (
          <ItemSecondaryText>
            <Placeholder preset="text" />
          </ItemSecondaryText>
        )}
      </ItemContent>
    </Item>
  );
}

type AnimalBreedItemProps = {
  animalBreed: AnimalBreed;
  size?: AvatarSize;
};

type AnimalBreedLinkItemProps = LinkItemProps & AnimalBreedItemProps;

export function AnimalBreedLinkItem({
  animalBreed,
  size = "large",
  ...rest
}: AnimalBreedLinkItemProps) {
  return (
    <LinkItem {...rest}>
      <ItemIcon>
        <Avatar size={size}>
          <FaDna />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{animalBreed.name}</ItemMainText>

        {isLarge(size) && (
          <ItemSecondaryText>
            {AnimalSpeciesLabels[animalBreed.species]}
          </ItemSecondaryText>
        )}
      </ItemContent>
    </LinkItem>
  );
}

type AnimalBreedButtonItemProps = ButtonItemProps & AnimalBreedItemProps;

export function AnimalBreedButtonItem({
  animalBreed,
  size = "large",
  ...rest
}: AnimalBreedButtonItemProps) {
  return (
    <ButtonItem {...rest}>
      <ItemIcon>
        <Avatar size={size}>
          <FaDna />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{animalBreed.name}</ItemMainText>

        {isLarge(size) && (
          <ItemSecondaryText>
            {AnimalSpeciesLabels[animalBreed.species]}
          </ItemSecondaryText>
        )}
      </ItemContent>
    </ButtonItem>
  );
}
