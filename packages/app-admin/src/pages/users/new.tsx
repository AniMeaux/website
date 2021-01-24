import {
  PageTitle,
  useCreateUser,
  UserForm,
  UserFormErrors,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { Main, Message, resolveUrl } from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { Header } from "../../core/header";
import { Navigation } from "../../core/navigation";

export default function CreateUserPage() {
  const router = useRouter();
  const [createUser, createUserRequest] = useCreateUser(() => {
    router.push(resolveUrl(router.asPath, "../?creationSucceeded"));
  });

  const errors: UserFormErrors = {};
  let globalErrorMessgae: string | null = null;

  if (createUserRequest.error != null) {
    const errorMessage = getErrorMessage(createUserRequest.error);

    if (
      hasErrorCode(createUserRequest.error, ErrorCode.USER_MISSING_DISPLAY_NAME)
    ) {
      errors.displayName = errorMessage;
    } else if (
      hasErrorCode(createUserRequest.error, [
        ErrorCode.USER_EMAIL_ALREADY_EXISTS,
        ErrorCode.USER_INVALID_EMAIL,
      ])
    ) {
      errors.email = errorMessage;
    } else if (
      hasErrorCode(createUserRequest.error, ErrorCode.USER_INVALID_PASSWORD)
    ) {
      errors.password = errorMessage;
    } else if (
      hasErrorCode(createUserRequest.error, ErrorCode.USER_MISSING_GROUP)
    ) {
      errors.groups = errorMessage;
    } else {
      globalErrorMessgae = errorMessage;
    }
  }

  return (
    <div>
      <PageTitle title="Nouvel utilisateur" />
      <Header headerTitle="Nouvel utilisateur" canGoBack />

      <Main>
        {globalErrorMessgae != null && (
          <Message type="error" className="mx-4 mb-4">
            {globalErrorMessgae}
          </Message>
        )}

        <UserForm
          onSubmit={createUser}
          pending={createUserRequest.isLoading}
          errors={errors}
        />
      </Main>

      <Navigation hideOnSmallScreen />
    </div>
  );
}
