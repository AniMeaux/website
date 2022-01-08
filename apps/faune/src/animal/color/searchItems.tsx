import { AnimalColorSearchHit } from "@animeaux/shared";
import {
  ButtonItem,
  ButtonItemProps,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
} from "core/dataDisplay/item";
import { Placeholder } from "core/loaders/placeholder";
import { FaPalette } from "react-icons/fa";

type AnimalColorItemProps = ButtonItemProps & {
  animalColor: AnimalColorSearchHit;
};

export function AnimalColorSearchItem({
  animalColor,
  ...rest
}: AnimalColorItemProps) {
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

export function AnimalColorItemPlaceholder() {
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
