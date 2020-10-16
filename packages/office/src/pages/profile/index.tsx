import { Link } from "@animeaux/shared";
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
import {
  Header,
  HeaderBackLink,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../ui/layouts/header";
import { Main } from "../../ui/layouts/main";
import { ProgressBar } from "../../ui/loaders/progressBar";
import { Message } from "../../ui/message";
import { Separator } from "../../ui/separator";

export default function ProfilePage() {
  const { currentUser, signOut, updateProfile } = useCurrentUser();
  const [displayName, setDisplayName] = React.useState(currentUser.displayName);

  const [
    updateProfileCallback,
    updateProfileCallbackState,
  ] = useAsyncCallback(async () => {
    if (currentUser.displayName !== displayName) {
      await updateProfile(displayName);
    }

    return true;
  }, [displayName, currentUser, updateProfile]);

  return (
    <>
      <Header>
        <HeaderBackLink href="/" />
        <HeaderTitle>Profile</HeaderTitle>
        <HeaderPlaceholder />
      </Header>

      {updateProfileCallbackState.pending && <ProgressBar />}

      <Main>
        <Separator large className="mb-2" />

        <Form className="px-4" onSubmit={updateProfileCallback}>
          {updateProfileCallbackState.error == null &&
            updateProfileCallbackState.value && (
              <Field>
                <Message type="success">
                  Votre profile à bien été mis à jour.
                </Message>
              </Field>
            )}

          <Field>
            <Label htmlFor="name">Nom</Label>
            <Input
              name="name"
              id="name"
              type="text"
              value={displayName}
              onChange={setDisplayName}
              errorMessage={updateProfileCallbackState.error?.message}
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
              disabled={updateProfileCallbackState.pending}
            >
              Modifier
            </Button>
          </Field>
        </Form>

        <Separator large className="my-2" />

        <div className="px-4 py-2">
          <Link
            href="/profile/password"
            className="a11y-focus w-full h-12 flex items-center"
          >
            <FaLock className="mr-4" />
            <span className="flex-1">Changer de mot de passe</span>
            <FaAngleRight />
          </Link>
        </div>

        <Separator large className="my-2" />

        <div className="px-4 py-2">
          <Button onClick={signOut} color="red" className="w-full">
            Se déconnecter
          </Button>
        </div>
      </Main>
    </>
  );
}
