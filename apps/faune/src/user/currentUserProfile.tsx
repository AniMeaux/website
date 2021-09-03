import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import {
  ButtonItem,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "core/dataDisplay/item";
import { Adornment } from "core/formElements/adornment";
import { Field } from "core/formElements/field";
import { FieldMessage } from "core/formElements/fieldMessage";
import { Form } from "core/formElements/form";
import { Input } from "core/formElements/input";
import { Label } from "core/formElements/label";
import { PasswordInput } from "core/formElements/passwordInput";
import { SubmitButton } from "core/formElements/submitButton";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Section } from "core/layouts/section";
import { Separator } from "core/layouts/separator";
import { PageTitle } from "core/pageTitle";
import { Modal, ModalHeader, ModalProps, useModal } from "core/popovers/modal";
import { showSnackbar, Snackbar } from "core/popovers/snackbar";
import { useMutation } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import * as React from "react";
import { FaAngleRight, FaLock, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useCurrentUser } from "user/currentUserContext";
import { UserItem } from "user/userItem";

export const CurrentUserPasswordForm: PageComponent = ({ children }) => {
  const router = useRouter();
  const backUrl = (router.query.backUrl as string | null) ?? "/";

  const { updatePassword } = useCurrentUser();
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

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
        showSnackbar.success(<Snackbar>Mot de passe changé</Snackbar>);

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

      {children}
    </ApplicationLayout>
  );
};

export const CurrentUserProfileForm: PageComponent = ({ children }) => {
  const router = useRouter();
  const backUrl = (router.query.backUrl as string | null) ?? "/";

  const { currentUser, updateProfile } = useCurrentUser();
  const [displayName, setDisplayName] = React.useState(currentUser.displayName);

  const mutation = useMutation<boolean, Error, string>(
    async (displayName) => {
      if (currentUser.displayName !== displayName) {
        await updateProfile(displayName);
      }

      return true;
    },
    {
      errorCodesToIgnore: [ErrorCode.USER_MISSING_DISPLAY_NAME],

      onSuccess() {
        showSnackbar.success(<Snackbar>Profil modifié</Snackbar>);

        router.backIfPossible(backUrl);
      },
    }
  );

  let errorMessage: string | null = null;

  if (
    mutation.error != null &&
    hasErrorCode(mutation.error, ErrorCode.USER_MISSING_DISPLAY_NAME)
  ) {
    errorMessage = getErrorMessage(mutation.error);
  }

  return (
    <ApplicationLayout>
      <PageTitle />

      <Header>
        <HeaderBackLink href={backUrl} />
        <HeaderTitle>Profil</HeaderTitle>
      </Header>

      <Main>
        <Form
          onSubmit={() => mutation.mutate(displayName)}
          pending={mutation.isLoading}
        >
          <Field>
            <Label htmlFor="name" hasError={errorMessage != null}>
              Nom
            </Label>

            <Input
              name="name"
              id="name"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={setDisplayName}
              hasError={errorMessage != null}
              leftAdornment={
                <Adornment>
                  <FaUser />
                </Adornment>
              }
            />

            <FieldMessage errorMessage={errorMessage} />
          </Field>

          <SubmitButton loading={mutation.isLoading}>Modifier</SubmitButton>
        </Form>
      </Main>

      {children}
    </ApplicationLayout>
  );
};

function Profile() {
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

type CurrentUserProfileProps = Pick<
  ModalProps,
  "open" | "onDismiss" | "referenceElement" | "placement"
>;

export function CurrentUserProfile(props: CurrentUserProfileProps) {
  return (
    <Modal {...props} dismissLabel="Fermer">
      <Profile />
    </Modal>
  );
}
