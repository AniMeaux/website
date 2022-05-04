import { CurrentUser } from "@animeaux/shared";
import { FaAngleRight, FaLock, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useCurrentUser } from "~/account/currentUser";
import {
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
} from "~/core/dataDisplay/item";
import { Section } from "~/core/layouts/section";
import { Separator } from "~/core/layouts/separator";
import {
  Modal,
  ModalHeader,
  ModalProps,
  useModal,
} from "~/core/popovers/modal";
import { useRouter } from "~/core/router";
import { UserAvatar } from "~/user/avatar";

type CurrentUserMenuProps = Pick<
  ModalProps,
  "open" | "onDismiss" | "referenceElement" | "placement"
>;

export function CurrentUserMenu(props: CurrentUserMenuProps) {
  return (
    <Modal {...props} dismissLabel="Fermer">
      <Menu />
    </Modal>
  );
}

function Menu() {
  const router = useRouter();
  const { currentUser, signOut } = useCurrentUser();
  const { onDismiss } = useModal();

  return (
    <>
      <ModalHeader dense>
        <UserItem user={currentUser} />
      </ModalHeader>

      <Section>
        <LinkItem
          href={`/edit-profile?backUrl=${encodeURIComponent(router.asPath)}`}
          onClick={onDismiss}
        >
          <ItemIcon>
            <FaUser />
          </ItemIcon>

          <ItemContent>
            <ItemMainText>Modifier mon profile</ItemMainText>
          </ItemContent>

          <ItemIcon>
            <FaAngleRight />
          </ItemIcon>
        </LinkItem>

        <LinkItem
          href={`/edit-password?backUrl=${encodeURIComponent(router.asPath)}`}
          onClick={onDismiss}
        >
          <ItemIcon>
            <FaLock />
          </ItemIcon>

          <ItemContent>
            <ItemMainText>Changer de mot de passe</ItemMainText>
          </ItemContent>

          <ItemIcon>
            <FaAngleRight />
          </ItemIcon>
        </LinkItem>
      </Section>

      <Separator />

      <Section>
        <ButtonItem onClick={signOut}>
          <ItemIcon>
            <FaSignOutAlt />
          </ItemIcon>

          <ItemContent>
            <ItemMainText>Se déconnecter</ItemMainText>
          </ItemContent>
        </ButtonItem>
      </Section>
    </>
  );
}

function UserItem({
  user,
}: {
  user: Pick<CurrentUser, "displayName" | "email">;
}) {
  return (
    <Item>
      <ItemIcon>
        <UserAvatar user={user} />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{user.displayName}</ItemMainText>
        <ItemSecondaryText>{user.email}</ItemSecondaryText>
      </ItemContent>
    </Item>
  );
}
