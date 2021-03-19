import { AnimalColor } from "@animeaux/shared-entities";
import {
  Avatar,
  AvatarSize,
  ButtonItem,
  ButtonItemProps,
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
import { FaPalette } from "react-icons/fa";

type AnimalColorItemPlaceholderProps = {
  size?: AvatarSize;
};

const AnimalColorItemPlaceholderSize: {
  [key in AvatarSize]: PlaceholderPreset;
} = {
  small: "avatar-small",
  medium: "avatar",
  large: "avatar-large",
  display: "avatar-display",
};

export function AnimalColorItemPlaceholder({
  size = "large",
}: AnimalColorItemPlaceholderProps) {
  return (
    <Item>
      <ItemIcon>
        <Placeholder preset={AnimalColorItemPlaceholderSize[size]} />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder preset="label" />
        </ItemMainText>
      </ItemContent>
    </Item>
  );
}

type AnimalColorItemProps = {
  animalColor: AnimalColor;
  size?: AvatarSize;
};

type AnimalColorLinkItemProps = LinkItemProps & AnimalColorItemProps;

export function AnimalColorLinkItem({
  animalColor,
  size = "large",
  ...rest
}: AnimalColorLinkItemProps) {
  return (
    <LinkItem {...rest}>
      <ItemIcon>
        <Avatar size={size}>
          <FaPalette />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{animalColor.name}</ItemMainText>
      </ItemContent>
    </LinkItem>
  );
}

type AnimalColorCuttonItemProps = ButtonItemProps & AnimalColorItemProps;

export function AnimalColorButtonItem({
  animalColor,
  size = "large",
  ...rest
}: AnimalColorCuttonItemProps) {
  return (
    <ButtonItem {...rest}>
      <ItemIcon>
        <Avatar size={size}>
          <FaPalette />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{animalColor.name}</ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}
