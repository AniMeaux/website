import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import {
  Adornment,
  ButtonItem,
  Field,
  FieldMessage,
  Form,
  Input,
  ItemContent,
  ItemIcon,
  ItemMainText,
  Label,
  LinkItem,
  Main,
  Modal,
  PasswordInput,
  Section,
  showSnackbar,
  Snackbar,
  SubmitButton,
  useModal,
  useRouter,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaAngleRight, FaLock, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Header } from "../header";
import { PageComponent, PageTitle } from "../page";
import { useMutation } from "../request";
import { useCurrentUser } from "./currentUserContext";
import { UserItem } from "./userItem";

export const CurrentUserPasswordForm: PageComponent = () => {
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
        showSnackbar.success(
          <Snackbar type="success">Mot de passe changé</Snackbar>
        );

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
    <div>
      <PageTitle
        title="Mot de passe"
        // `applicationName` is only used as a fallback if `title` is missing.
        applicationName=""
      />

      <Header headerTitle="Mot de passe" canGoBack backHref={backUrl} />

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

          <SubmitButton disabled={mutation.isLoading}>Modifier</SubmitButton>
        </Form>
      </Main>
    </div>
  );
};

export const CurrentUserProfileForm: PageComponent = () => {
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
        showSnackbar.success(
          <Snackbar type="success">Profil modifié</Snackbar>
        );

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
    <div>
      <PageTitle
        title="Profil"
        // `applicationName` is only used as a fallback if `title` is missing.
        applicationName=""
      />

      <Header headerTitle="Profil" canGoBack backHref={backUrl} />

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

          <SubmitButton disabled={mutation.isLoading}>Modifier</SubmitButton>
        </Form>
      </Main>
    </div>
  );
};

function Profile() {
  const router = useRouter();
  const { currentUser, signOut } = useCurrentUser();
  const { onDismiss } = useModal();

  return (
    <>
      <Section className="border-b border-gray-100">
        <UserItem user={currentUser} />
      </Section>

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

      <hr className="mx-4 my-1 border-t border-gray-100" />

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

export type CurrentUserProfileHandle = {
  open(): void;
};

type CurrentUserProfileProps = {
  refProp?: React.RefObject<CurrentUserProfileHandle>;
};

export function CurrentUserProfile({ refProp }: CurrentUserProfileProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useImperativeHandle(refProp, () => ({
    open: () => setIsVisible(true),
  }));

  return (
    <Modal
      open={isVisible}
      onDismiss={() => setIsVisible(false)}
      dismissLabel="Fermer"
    >
      {isVisible && <Profile />}
    </Modal>
  );
}
