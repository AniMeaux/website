import { AnimalColor } from "@animeaux/shared-entities";
import { Avatar, AvatarPlaceholder } from "core/dataDisplay/avatar";
import {
  ButtonItem,
  ButtonItemProps,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  LinkItemProps,
} from "core/dataDisplay/item";
import { Placeholder } from "core/loaders/placeholder";
import { FaPalette } from "react-icons/fa";

export function AnimalColorItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <AvatarPlaceholder />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder $preset="label" />
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

type AnimalColorSearchItemProps = ButtonItemProps & AnimalColorItemProps;

export function AnimalColorSearchItem({
  animalColor,
  ...rest
}: AnimalColorSearchItemProps) {
  return (
    <ButtonItem {...rest}>
      <ItemIcon>
        <FaPalette />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{animalColor.name}</ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}

export function AnimalColorSearchItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <Placeholder $preset="icon" />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder $preset="label" />
        </ItemMainText>
      </ItemContent>
    </Item>
  );
}
