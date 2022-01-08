import { AnimalBreedSearchHit } from "@animeaux/shared";
import {
  ButtonItem,
  ButtonItemProps,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
} from "core/dataDisplay/item";
import { Markdown } from "core/dataDisplay/markdown";
import { Placeholder } from "core/loaders/placeholder";
import { FaDna } from "react-icons/fa";

type AnimalBreedItemProps = ButtonItemProps & {
  animalBreed: AnimalBreedSearchHit;
};

export function AnimalBreedSearchItem({
  animalBreed,
  ...rest
}: AnimalBreedItemProps) {
  return (
    <ButtonItem {...rest}>
      <ItemIcon>
        <FaDna />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Markdown preset="inline">{animalBreed.highlightedName}</Markdown>
        </ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}

export function AnimalBreedItemPlaceholder() {
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
