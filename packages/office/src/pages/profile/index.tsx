import { getErrorMessage } from "@animeaux/shared";
import * as React from "react";
import { useAsyncCallback } from "react-behave";
import { FaAngleRight, FaLock, FaUser } from "react-icons/fa";
import { useCurrentUser } from "../../core/user";
import { Button } from "../../ui/button";
import { Adornment } from "../../ui/formElements/adornment";
import { Field } from "../../ui/formElements/field";
import { Form } from "../../ui/formElements/form";
import { Input } from "../../ui/formElements/input";
import { Label } from "../../ui/formElements/label";
import { ItemContent, ItemIcon, ItemMainText, LinkItem } from "../../ui/item";
import {
  Header,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../ui/layouts/header";
import { Main } from "../../ui/layouts/main";
import { Section, SectionTitle } from "../../ui/layouts/section";
import { ProgressBar } from "../../ui/loaders/progressBar";
import { Message } from "../../ui/message";
import { Separator } from "../../ui/separator";

export default function ProfilePage() {
  const { currentUser, signOut, updateProfile } = useCurrentUser();
  const [displayName, setDisplayName] = React.useState(currentUser.displayName);

  const [
    updateProfileCallback,
    { pending, value: hasSucceeded, error },
  ] = useAsyncCallback(async () => {
    if (currentUser.displayName !== displayName) {
      await updateProfile(displayName);
    }

    return true;
  }, [displayName, currentUser, updateProfile]);

  return (
    <>
      <Header>
        <HeaderPlaceholder />
        <HeaderTitle>Profile</HeaderTitle>
        <HeaderPlaceholder />
      </Header>

      {pending && <ProgressBar />}

      <Main>
        <Section>
          <SectionTitle>Mettre à jour votre profile</SectionTitle>

          {error == null && hasSucceeded && (
            <Message type="success" className="mx-2 my-2">
              Votre profile à bien été mis à jour.
            </Message>
          )}

          <Form
            className="px-2"
            onSubmit={updateProfileCallback}
            pending={pending}
          >
            <Field>
              <Label htmlFor="name">Nom</Label>
              <Input
                name="name"
                id="name"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={setDisplayName}
                errorMessage={error == null ? null : getErrorMessage(error)}
                leftAdornment={
                  <Adornment>
                    <FaUser />
                  </Adornment>
                }
              />
            </Field>

            <Field>
              <Button
                type="submit"
                variant="primary"
                color="blue"
                disabled={pending}
              >
                Modifier
              </Button>
            </Field>
          </Form>
        </Section>

        <Separator />

        <Section>
          <SectionTitle>Mon compte</SectionTitle>

          <LinkItem href="/profile/password">
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
          <SectionTitle>Actions</SectionTitle>

          <Button onClick={signOut} color="red" className="w-full">
            Se déconnecter
          </Button>
        </Section>
      </Main>
    </>
  );
}
