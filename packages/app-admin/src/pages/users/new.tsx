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
import {
  Header,
  HeaderBackLink,
  HeaderPlaceholder,
  HeaderTitle,
  Message,
  resolveUrl,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";

export default function CreateUserPage() {
  const router = useRouter();
  const [createUser, createUserRequest] = useCreateUser((user) => {
    router.push(resolveUrl(router.asPath, `../${user.id}?creationSucceeded`));
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

      <Header>
        <HeaderBackLink href=".." />
        <HeaderTitle>Nouvel utilisateur</HeaderTitle>
        <HeaderPlaceholder />
      </Header>

      <main className="py-4">
        {globalErrorMessgae != null && (
          <Message type="error" className="mx-4 mb-2">
            {globalErrorMessgae}
          </Message>
        )}

        <UserForm
          onSubmit={createUser}
          pending={createUserRequest.isLoading}
          errors={errors}
        />
      </main>
    </div>
  );
}
