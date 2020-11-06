import { getErrorMessage } from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { useAsyncCallback } from "react-behave";
import { ResourceIcon } from "../core/resource";
import { useCurrentUser } from "../core/user/currentUserContext";
import { Button } from "../ui/button";
import { Adornment } from "../ui/formElements/adornment";
import { Field } from "../ui/formElements/field";
import { Form } from "../ui/formElements/form";
import { Input } from "../ui/formElements/input";
import { Label } from "../ui/formElements/label";
import {
  Header,
  HeaderBackLink,
  HeaderPlaceholder,
  HeaderTitle,
} from "../ui/layouts/header";
import { Main, PageLayout } from "../ui/layouts/page";
import { ProgressBar } from "../ui/loaders/progressBar";
import { Message } from "../ui/message";

export default function EditProfile() {
  const router = useRouter();
  const back = (router.query.back as string) ?? "/";

  const { currentUser, updateProfile } = useCurrentUser();
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
    <PageLayout
      header={
        <Header>
          <HeaderBackLink href={back} />
          <HeaderTitle>Mon profile</HeaderTitle>
          <HeaderPlaceholder />
        </Header>
      }
    >
      {pending && <ProgressBar />}

      <Main center className="px-4">
        {error == null && hasSucceeded && (
          <Message type="success" className="my-2">
            Votre profile à bien été mis à jour.
          </Message>
        )}

        <Form onSubmit={updateProfileCallback} pending={pending}>
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
                  <ResourceIcon resourceKey="user" />
                </Adornment>
              }
            />
          </Field>

          <Field className="md:items-start">
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
      </Main>
    </PageLayout>
  );
}
