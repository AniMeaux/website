import {
  getAnimalDisplayName,
  SearchableAnimal,
  SearchResponseItem,
} from "@animeaux/shared-entities";
import { Avatar } from "core/dataDisplay/avatar";
import { AvatarImage } from "core/dataDisplay/image";
import {
  ButtonItem,
  ButtonItemProps,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  LinkItemProps,
} from "core/dataDisplay/item";
import { MarkdownInline } from "core/dataDisplay/markdown";
import { Placeholder } from "core/loaders/placeholder";
import { FaMapMarkerAlt } from "react-icons/fa";

export function SearchableAnimalItemPlaceholder() {
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

type SearchableAnimalLinkItemProps = LinkItemProps & {
  animal: SearchableAnimal;
};

export function SearchableAnimalLinkItem({
  animal,
  ...rest
}: SearchableAnimalLinkItemProps) {
  const displayName = getAnimalDisplayName(animal);

  return (
    <LinkItem {...rest}>
      <ItemIcon>
        <Avatar>
          <AvatarImage image={animal.avatarId} alt={displayName} />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{displayName}</ItemMainText>
      </ItemContent>
    </LinkItem>
  );
}

export function LocationItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <Placeholder preset="icon" />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder preset="label" />
        </ItemMainText>
      </ItemContent>
    </Item>
  );
}

type LocationItemProps = ButtonItemProps & {
  location: SearchResponseItem;
};

export function LocationItem({ location, ...rest }: LocationItemProps) {
  return (
    <ButtonItem {...rest}>
      <ItemIcon>
        <FaMapMarkerAlt />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <MarkdownInline>{location.highlighted}</MarkdownInline>
        </ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}
