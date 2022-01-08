import { HostFamilySearchHit } from "@animeaux/shared";
import {
  ButtonItem,
  ButtonItemProps,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "core/dataDisplay/item";
import { Markdown } from "core/dataDisplay/markdown";
import { Placeholder } from "core/loaders/placeholder";
import { FaHome, FaPlus } from "react-icons/fa";

type HostFamilyItemProps = ButtonItemProps & {
  hostFamily: HostFamilySearchHit;
};

export function HostFamilyItem({ hostFamily, ...rest }: HostFamilyItemProps) {
  return (
    <ButtonItem {...rest}>
      <ItemIcon>
        <FaHome />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Markdown preset="inline">{hostFamily.highlightedName}</Markdown>
        </ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}

export function CreateHostFamilyItem() {
  return (
    <LinkItem href="../new-host-family" color="blue">
      <ItemIcon>
        <FaPlus />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>Créer une famille d'accueil</ItemMainText>
      </ItemContent>
    </LinkItem>
  );
}

export function HostFamilyItemPlaceholder() {
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
