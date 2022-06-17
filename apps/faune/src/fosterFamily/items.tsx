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
  LinkItemProps,
} from "~/core/dataDisplay/item";
import { Markdown } from "~/core/dataDisplay/markdown";
import { Placeholder } from "~/core/loaders/placeholder";

type FosterFamilyButtonItemProps = ButtonItemProps & {
  fosterFamily: FosterFamilySearchHit;
};

export function FosterFamilyButtonItem({
  fosterFamily,
  ...rest
}: FosterFamilyButtonItemProps) {
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

type FosterFamilyLinkItemProps = LinkItemProps & {
  fosterFamily: FosterFamilySearchHit;
};

export function FosterFamilyLinkItem({
  fosterFamily,
  ...rest
}: FosterFamilyLinkItemProps) {
  return (
    <LinkItem {...rest}>
      <ItemIcon>
        <FaHome />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Markdown preset="inline">{fosterFamily.highlightedName}</Markdown>
        </ItemMainText>
      </ItemContent>
    </LinkItem>
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
