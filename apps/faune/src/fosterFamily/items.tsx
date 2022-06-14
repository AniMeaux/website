import { FosterFamilySearchHit } from "@animeaux/shared";
import { FaHome, FaPlus } from "react-icons/fa";
import {
  ButtonItem,
  ButtonItemProps,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "~/core/dataDisplay/item";
import { Markdown } from "~/core/dataDisplay/markdown";
import { Placeholder } from "~/core/loaders/placeholder";

type FosterFamilyItemProps = ButtonItemProps & {
  fosterFamily: FosterFamilySearchHit;
};

export function FosterFamilyItem({
  fosterFamily,
  ...rest
}: FosterFamilyItemProps) {
  return (
    <ButtonItem {...rest}>
      <ItemIcon>
        <FaHome />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Markdown preset="inline">{fosterFamily.highlightedName}</Markdown>
        </ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}

export function CreateFosterFamilyItem() {
  return (
    <LinkItem href="../new-foster-family" color="blue">
      <ItemIcon>
        <FaPlus />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>Créer une famille d'accueil</ItemMainText>
      </ItemContent>
    </LinkItem>
  );
}

export function FosterFamilyItemPlaceholder() {
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
