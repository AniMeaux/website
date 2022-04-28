import { ManagerSearchHit } from "@animeaux/shared";
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
import { FaUser } from "react-icons/fa";

type UserItemProps = ButtonItemProps & {
  manager: Pick<ManagerSearchHit, "highlightedDisplayName">;
};

export function ManagerItem({ manager, ...rest }: UserItemProps) {
  return (
    <ButtonItem {...rest}>
      <ItemIcon>
        <FaUser />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Markdown preset="inline">{manager.highlightedDisplayName}</Markdown>
        </ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}

export function ManagerItemPlaceholder() {
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
