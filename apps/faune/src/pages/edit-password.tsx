import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { useCurrentUser } from "account/currentUser";
import { Adornment } from "core/formElements/adornment";
import { Field } from "core/formElements/field";
import { FieldMessage } from "core/formElements/fieldMessage";
import { Form } from "core/formElements/form";
import { Label } from "core/formElements/label";
import { PasswordInput } from "core/formElements/passwordInput";
import { SubmitButton } from "core/formElements/submitButton";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { PageTitle } from "core/pageTitle";
import { useMutation } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import { useState } from "react";
import { FaLock } from "react-icons/fa";

const EditPassword: PageComponent = () => {
  const router = useRouter();
  const backUrl = (router.query.backUrl as string | null) ?? "/";

  const { updatePassword } = useCurrentUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const mutation = useMutation<
    boolean,
    Error,
    { currentPassword: string; newPassword: string }
  >(
    async ({ currentPassword, newPassword }) => {
      await updatePassword(currentPassword, newPassword);
      return true;
    },
    {
      errorCodesToIgnore: [
        ErrorCode.AUTH_WRONG_PASSWORD,
        ErrorCode.AUTH_WEEK_PASSWORD,
      ],

      onSuccess() {
        router.backIfPossible(backUrl);
      },
    }
  );

  let currentPasswordError: string | null = null;
  let newPasswordError: string | null = null;

  if (mutation.error != null) {
    const errorMessage = getErrorMessage(mutation.error);

    if (hasErrorCode(mutation.error, ErrorCode.AUTH_WRONG_PASSWORD)) {
      currentPasswordError = errorMessage;
    } else if (hasErrorCode(mutation.error, ErrorCode.AUTH_WEEK_PASSWORD)) {
      newPasswordError = errorMessage;
    }
  }

  return (
    <ApplicationLayout>
      <PageTitle title="Mot de passe" />

      <Header>
        <HeaderBackLink href={backUrl} />
        <HeaderTitle>Mot de passe</HeaderTitle>
      </Header>

      <Main>
        <Form
          onSubmit={() => mutation.mutate({ currentPassword, newPassword })}
          pending={mutation.isLoading}
        >
          <Field>
            <Label htmlFor="password" hasError={currentPasswordError != null}>
              Mot de passe actuel
            </Label>

            <PasswordInput
              name="password"
              id="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={setCurrentPassword}
              hasError={currentPasswordError != null}
              leftAdornment={
                <Adornment>
                  <FaLock />
                </Adornment>
              }
            />

            <FieldMessage errorMessage={currentPasswordError} />
          </Field>

          <Field>
            <Label htmlFor="new-password" hasError={newPasswordError != null}>
              Nouveau mot de passe
            </Label>

            <PasswordInput
              name="new-password"
              id="new-password"
              autoComplete="new-password"
              value={newPassword}
              onChange={setNewPassword}
              hasError={newPasswordError != null}
              leftAdornment={
                <Adornment>
                  <FaLock />
                </Adornment>
              }
            />

            <FieldMessage errorMessage={newPasswordError} />
          </Field>

          <SubmitButton loading={mutation.isLoading}>Modifier</SubmitButton>
        </Form>
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

export default EditPassword;
