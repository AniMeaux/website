import { AnimalColor } from "@animeaux/shared-entities";
import * as React from "react";
import { FaPalette } from "react-icons/fa";
import { Avatar } from "ui/dataDisplay/avatar";
import {
  ButtonItem,
  ButtonItemProps,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  LinkItemProps,
} from "ui/dataDisplay/item";
import { Placeholder } from "ui/loaders/placeholder";

export function AnimalColorItemPlaceholder() {
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

type AnimalColorItemProps = {
  animalColor: AnimalColor;
};

type AnimalColorLinkItemProps = LinkItemProps & AnimalColorItemProps;

export function AnimalColorLinkItem({
  animalColor,
  ...rest
}: AnimalColorLinkItemProps) {
  return (
    <LinkItem {...rest}>
      <ItemIcon>
        <Avatar>
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
  ...rest
}: AnimalColorCuttonItemProps) {
  return (
    <ButtonItem {...rest}>
      <ItemIcon>
        <Avatar>
          <FaPalette />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{animalColor.name}</ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}
