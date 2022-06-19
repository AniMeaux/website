import {
  AnimalFamily,
  AnimalRelative,
  hasGroups,
  UserGroup,
} from "@animeaux/shared";
import { FaLongArrowAltDown, FaLongArrowAltRight } from "react-icons/fa";
import styled from "styled-components";
import { Link } from "~/core/actions/link";
import { Avatar } from "~/core/dataDisplay/avatar";
import { AvatarImage } from "~/core/dataDisplay/image";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "~/core/dataDisplay/item";
import { useCurrentUser } from "~/currentUser/currentUser";
import { theme } from "~/styles/theme";

const EMPTY_ITEM = (
  <Item>
    <ItemContent>
      <ItemMainText>Inconnus</ItemMainText>
    </ItemContent>
  </Item>
);

export function AnimalFamilyItem({
  family,
  hightlightAnimalId,
}: {
  family: AnimalFamily;
  hightlightAnimalId?: string;
}) {
  const { currentUser } = useCurrentUser();
  const currentUserCanEdit = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  return (
    <Container>
      <Content>
        <Group>
          <GroupTitle>Parents</GroupTitle>
          {family.parents.length === 0 ? EMPTY_ITEM : null}

          {family.parents.map((parent) => (
            <AnimalRelativeItem
              key={parent.id}
              animal={parent}
              isCurrentAnimal={parent.id === hightlightAnimalId}
            />
          ))}
        </Group>

        <ArrowContainer>
          <ArrowRight />
          <ArrowDown />
        </ArrowContainer>

        <Group>
          <GroupTitle>Petits</GroupTitle>
          {family.children.length === 0 ? EMPTY_ITEM : null}

          {family.children.map((child) => (
            <AnimalRelativeItem
              key={child.id}
              animal={child}
              isCurrentAnimal={child.id === hightlightAnimalId}
            />
          ))}
        </Group>
      </Content>

      {currentUserCanEdit ? (
        <Link href={`/animal-families/${family.id}/edit`}>Modifier</Link>
      ) : null}
    </Container>
  );
}

const Container = styled.section`
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.m};
  padding: ${theme.spacing.x4};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.x4};

  @media (min-width: ${theme.screenSizes.medium.start}) {
    align-items: flex-end;
  }
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.x2};

  @media (min-width: ${theme.screenSizes.medium.start}) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const Group = styled.div`
  flex: auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.background.primary};
  border-radius: ${theme.borderRadius.m};
  padding: ${theme.spacing.x2};
`;

const GroupTitle = styled.h3`
  padding: ${theme.spacing.x1} ${theme.spacing.x2};
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;

const ArrowContainer = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;

  @media (min-width: ${theme.screenSizes.medium.start}) {
    padding: ${theme.spacing.x4} 0;
  }
`;

const ArrowRight = styled(FaLongArrowAltRight)`
  @media (max-width: ${theme.screenSizes.small.end}) {
    display: none;
  }
`;

const ArrowDown = styled(FaLongArrowAltDown)`
  @media (min-width: ${theme.screenSizes.medium.start}) {
    display: none;
  }
`;

function AnimalRelativeItem({
  animal,
  isCurrentAnimal,
}: {
  animal: AnimalRelative;
  isCurrentAnimal: boolean;
}) {
  const content = (
    <>
      <ItemIcon>
        <Avatar $isSmall>
          <AvatarImage image={animal.avatarId} alt={animal.name} />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{animal.name}</ItemMainText>
      </ItemContent>
    </>
  );

  if (isCurrentAnimal) {
    return <Item color={isCurrentAnimal ? "blue" : "default"}>{content}</Item>;
  }

  return <LinkItem href={`/animals/${animal.id}`}>{content}</LinkItem>;
}
