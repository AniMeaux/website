import { HostFamily } from "@animeaux/shared-entities";
import {
  Avatar,
  ButtonItem,
  ButtonItemProps,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemProps,
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

type HostFamilyContentProps = {
  hostFamily: HostFamily;
};

function HostFamilyContent({ hostFamily }: HostFamilyContentProps) {
  return (
    <>
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
    </>
  );
}

type HostFamilyLinkItemProps = LinkItemProps & HostFamilyContentProps;

export function HostFamilyLinkItem({
  hostFamily,
  ...rest
}: HostFamilyLinkItemProps) {
  return (
    <LinkItem {...rest}>
      <HostFamilyContent hostFamily={hostFamily} />
    </LinkItem>
  );
}

type HostFamilyItemProps = ItemProps & HostFamilyContentProps;

export function HostFamilyItem({ hostFamily, ...rest }: HostFamilyItemProps) {
  return (
    <Item {...rest}>
      <HostFamilyContent hostFamily={hostFamily} />
    </Item>
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
