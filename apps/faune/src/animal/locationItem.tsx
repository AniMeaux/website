import { LocationSearchHit } from "@animeaux/shared";
import { FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import {
  ButtonItem,
  ButtonItemProps,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
} from "~/core/dataDisplay/item";
import { Markdown } from "~/core/dataDisplay/markdown";
import { Placeholder } from "~/core/loaders/placeholder";

type LocationItemProps = ButtonItemProps & {
  location: LocationSearchHit;
};

export function LocationItem({ location, ...rest }: LocationItemProps) {
  return (
    <ButtonItem {...rest}>
      <ItemIcon>
        <FaMapMarkerAlt />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Markdown preset="inline">{location.highlightedValue}</Markdown>
        </ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}

type AddLocationItemProps = ButtonItemProps & {
  search: string;
};

export function AddLocationItem({ search, ...rest }: AddLocationItemProps) {
  return (
    <ButtonItem color="blue" {...rest}>
      <ItemIcon>
        <FaPlus />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Markdown preset="inline">{`Ajouter : **${search}**`}</Markdown>
        </ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}

export function LocationItemPlaceholder() {
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
