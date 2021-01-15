import {
  PageTitle,
  UserForm,
  UserFormErrors,
  UserFormPlaceholder,
  useUpdateUser,
  useUser,
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
  Placeholder,
  resolveUrl,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";

export default function UserEditPage() {
  const router = useRouter();
  const userId = router.query.userId as string;
  const [user, userRequest] = useUser(userId);
  const [updateUser, updateUserRequest] = useUpdateUser(() => {
    router.push(resolveUrl(router.asPath, "..?updateSucceeded"));
  });

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;

  if (user != null) {
    pageTitle = `Modifier : ${user.displayName}`;
    headerTitle = pageTitle;
  } else if (userRequest.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (userRequest.error != null) {
    headerTitle = "Oups";
    pageTitle = "Oups";
  }

  const errors: UserFormErrors = {};
  let globalErrorMessgae: string | null = null;

  if (updateUserRequest.error != null) {
    const errorMessage = getErrorMessage(updateUserRequest.error);

    if (
      hasErrorCode(updateUserRequest.error, ErrorCode.USER_MISSING_DISPLAY_NAME)
    ) {
      errors.displayName = errorMessage;
    } else if (
      hasErrorCode(updateUserRequest.error, ErrorCode.USER_INVALID_PASSWORD)
    ) {
      errors.password = errorMessage;
    } else if (
      hasErrorCode(updateUserRequest.error, [
        ErrorCode.USER_MISSING_GROUP,
        ErrorCode.USER_IS_ADMIN,
      ])
    ) {
      errors.groups = errorMessage;
    } else {
      globalErrorMessgae = errorMessage;
    }
  }

  let content: React.ReactNode | null = null;

  if (user != null) {
    content = (
      <UserForm
        user={user}
        onSubmit={(formPayload) =>
          updateUser({ currentUser: user, formPayload })
        }
        pending={updateUserRequest.isLoading}
        errors={errors}
      />
    );
  } else if (userRequest.isLoading) {
    content = <UserFormPlaceholder />;
  }

  return (
    <div>
      <PageTitle title={pageTitle} />

      <Header>
        <HeaderBackLink href=".." />
        <HeaderTitle>{headerTitle}</HeaderTitle>
        <HeaderPlaceholder />
      </Header>

      <main className="py-4">
        {globalErrorMessgae != null && (
          <Message type="error" className="mx-4 mb-2">
            {globalErrorMessgae}
          </Message>
        )}

        {userRequest.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(userRequest.error)}
          </Message>
        )}

        {content}
      </main>
    </div>
  );
}
