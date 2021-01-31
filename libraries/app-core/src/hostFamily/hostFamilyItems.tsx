import { HostFamily } from "@animeaux/shared-entities";
import {
  Avatar,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
  LinkItemProps,
  Placeholder,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaHome } from "react-icons/fa";

export function HostFamilyItemPlaceholder() {
  return (
    <Item size="large">
      <ItemIcon>
        <Placeholder preset="avatar" />
      </ItemIcon>

      <ItemContent>
        <Placeholder preset="label" />
        <Placeholder preset="text" className="text-xs" />
      </ItemContent>
    </Item>
  );
}

type HostFamilyItemProps = LinkItemProps & {
  hostFamily: HostFamily;
};

export function HostFamilyItem({ hostFamily, ...rest }: HostFamilyItemProps) {
  return (
    <LinkItem {...rest} size="large">
      <ItemIcon>
        <Avatar>
          <FaHome />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{hostFamily.name}</ItemMainText>
        <ItemSecondaryText>{hostFamily.email}</ItemSecondaryText>
      </ItemContent>
    </LinkItem>
  );
}
