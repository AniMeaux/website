import { useRouter } from "next/router";
import * as React from "react";
import { FaAngleRight, FaLock, FaUser } from "react-icons/fa";
import { Button } from "../../ui/button";
import { ItemContent, ItemIcon, ItemMainText, LinkItem } from "../../ui/item";
import { Section } from "../../ui/layouts/section";
import { Separator } from "../../ui/separator";
import { useCurrentUser } from "./currentUserContext";
import { UserItem } from "./userItem";

export function CurrentUserProfile() {
  const router = useRouter();
  const back = encodeURIComponent(router.asPath);
  const { currentUser, signOut } = useCurrentUser();

  return (
    <div className="min-w-xs">
      <Section>
        <UserItem user={currentUser} />
      </Section>

      <Separator />

      <Section>
        <LinkItem href={`/profile-edit?back=${back}`}>
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

        <LinkItem href={`/profile-edit-password?back=${back}`}>
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

      <Section className="px-4">
        <Button color="red" className="w-full" onClick={signOut}>
          Se déconnecter
        </Button>
      </Section>
    </div>
  );
}
