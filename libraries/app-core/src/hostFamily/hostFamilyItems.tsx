import { HostFamily } from "@animeaux/shared-entities";
import {
  Avatar,
  ButtonItem,
  ButtonItemProps,
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
    <Item>
      <ItemIcon>
        <Placeholder preset="avatar-large" />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder preset="label" />
        </ItemMainText>

        <ItemSecondaryText>
          <Placeholder preset="text" />
        </ItemSecondaryText>
      </ItemContent>
    </Item>
  );
}

type HostFamilyItemProps = LinkItemProps & {
  hostFamily: HostFamily;
};

export function HostFamilyItem({ hostFamily, ...rest }: HostFamilyItemProps) {
  return (
    <LinkItem {...rest}>
      <ItemIcon>
        <Avatar size="large">
          <FaHome />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{hostFamily.name}</ItemMainText>
        <ItemSecondaryText>
          {hostFamily.city} ({hostFamily.zipCode.substring(0, 2)})
        </ItemSecondaryText>
      </ItemContent>
    </LinkItem>
  );
}

export function HostFamilySearchItemPlaceholder() {
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

type HostFamilySearchItemProps = ButtonItemProps & {
  hostFamily: HostFamily;
};

export function HostFamilySearchItem({
  hostFamily,
  ...rest
}: HostFamilySearchItemProps) {
  return (
    <ButtonItem {...rest}>
      <ItemIcon>
        <Avatar size="medium">
          <FaHome />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{hostFamily.name}</ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}
