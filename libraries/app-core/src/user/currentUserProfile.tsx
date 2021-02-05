import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import {
  Adornment,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetRef,
  Button,
  ButtonItem,
  ButtonSection,
  Field,
  FieldMessage,
  Form,
  HeaderBackButton,
  HeaderIconOnlyLinkPlaceholder,
  HeaderTitle,
  Input,
  ItemContent,
  ItemIcon,
  ItemMainText,
  Label,
  PasswordInput,
  Section,
  showSnackbar,
  Snackbar,
  SubmitButton,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaAngleRight, FaLock, FaUser } from "react-icons/fa";
import { useMutation } from "../request";
import { useCurrentUser } from "./currentUserContext";
import { UserItem } from "./userItem";

type EditCurrentUserPasswordFormProps = {
  onSuccess: () => void;
};

function PasswordForm({ onSuccess }: EditCurrentUserPasswordFormProps) {
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

        onSuccess();
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
          autoComplete="password"
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
  );
}

type EditCurrentUserProfileFormProps = {
  onSuccess: () => void;
};

function ProfileForm({ onSuccess }: EditCurrentUserProfileFormProps) {
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
          <Snackbar type="success">Profile modifié</Snackbar>
        );

        onSuccess();
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
  );
}

type ProfileProps = {
  onEditProfile: () => void;
  onEditPassword: () => void;
};

function Profile({ onEditPassword, onEditProfile }: ProfileProps) {
  const { signOut } = useCurrentUser();

  return (
    <div>
      <Section className="space-y-2">
        <ButtonItem
          onClick={() => onEditProfile()}
          className="bg-gray-50 active:bg-gray-100"
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
        </ButtonItem>

        <ButtonItem
          onClick={() => onEditPassword()}
          className="bg-gray-50 active:bg-gray-100"
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
        </ButtonItem>
      </Section>

      <ButtonSection>
        <Button color="red" onClick={signOut}>
          Se déconnecter
        </Button>
      </ButtonSection>
    </div>
  );
}

enum UserProfilePanel {
  PROFILE,
  EDIT_PROFILE,
  EDIT_PASSWORD,
}

export type CurrentUserProfileHandle = {
  open(): void;
};

type CurrentUserProfileProps = {
  refProp?: React.RefObject<CurrentUserProfileHandle>;
};

export function CurrentUserProfile({ refProp }: CurrentUserProfileProps) {
  const { currentUser } = useCurrentUser();
  const [
    visiblePanel,
    setVisiblePanel,
  ] = React.useState<UserProfilePanel | null>(null);

  React.useImperativeHandle(refProp, () => ({
    open() {
      setVisiblePanel(UserProfilePanel.PROFILE);
    },
  }));

  const bottomSheet = React.useRef<BottomSheetRef>(null!);

  let content: React.ReactNode = null;
  if (visiblePanel === UserProfilePanel.PROFILE) {
    content = (
      <Profile
        onEditProfile={() => {
          setVisiblePanel(UserProfilePanel.EDIT_PROFILE);
          bottomSheet.current.snapTo(({ maxHeight }) => maxHeight);
        }}
        onEditPassword={() => {
          setVisiblePanel(UserProfilePanel.EDIT_PASSWORD);
          bottomSheet.current.snapTo(({ maxHeight }) => maxHeight);
        }}
      />
    );
  } else if (visiblePanel === UserProfilePanel.EDIT_PROFILE) {
    content = <ProfileForm onSuccess={() => setVisiblePanel(null)} />;
  } else if (visiblePanel === UserProfilePanel.EDIT_PASSWORD) {
    content = <PasswordForm onSuccess={() => setVisiblePanel(null)} />;
  }

  let header: React.ReactNode = null;
  if (visiblePanel === UserProfilePanel.PROFILE) {
    header = <UserItem user={currentUser} className="px-4" />;
  } else if (
    visiblePanel === UserProfilePanel.EDIT_PROFILE ||
    visiblePanel === UserProfilePanel.EDIT_PASSWORD
  ) {
    header = (
      <BottomSheetHeader>
        <HeaderBackButton
          onClick={() => {
            setVisiblePanel(UserProfilePanel.PROFILE);
            bottomSheet.current.snapTo(({ minHeight }) => minHeight);
          }}
        />

        <HeaderTitle>
          {visiblePanel === UserProfilePanel.EDIT_PROFILE
            ? "Profile"
            : "Mot de passe"}
        </HeaderTitle>

        <HeaderIconOnlyLinkPlaceholder />
      </BottomSheetHeader>
    );
  }

  return (
    <BottomSheet
      open={visiblePanel != null}
      onDismiss={() => setVisiblePanel(null)}
      snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight]}
      defaultSnap={({ minHeight }) => minHeight}
      ref={bottomSheet}
      header={header}
    >
      {content}
    </BottomSheet>
  );
}
