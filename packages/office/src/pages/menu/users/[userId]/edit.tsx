import { ErrorCode, getErrorMessage, hasErrorCode } from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { PageComponent } from "../../../../core/pageComponent";
import {
  UserForm,
  UserFormErrors,
  UserFormPlaceholder,
} from "../../../../core/user/userForm";
import { useUpdateUser, useUser } from "../../../../core/user/userQueries";
import { Aside, AsideLayout } from "../../../../ui/layouts/aside";
import {
  AsideHeaderTitle,
  Header,
  HeaderBackLink,
  HeaderCloseLink,
} from "../../../../ui/layouts/header";
import { PageTitle } from "../../../../ui/layouts/page";
import { Placeholder } from "../../../../ui/loaders/placeholder";
import { Message } from "../../../../ui/message";
import { UsersPage } from "../index";

const EditUserPage: PageComponent = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const { user, isUserLoading, userError } = useUser(userId);
  const { updateUser, isUpdateUserLoading, updateUserError } = useUpdateUser();

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;
  if (user != null) {
    pageTitle = `Modifier ${user.displayName}`;
    headerTitle = user.displayName;
  } else if (isUserLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (userError != null) {
    pageTitle = "Oups";
    headerTitle = "Oups";
  }

  const errors: UserFormErrors = {};
  let globalErrorMessgae: string | null = null;

  if (updateUserError != null) {
    const errorMessage = getErrorMessage(updateUserError);

    if (hasErrorCode(updateUserError, ErrorCode.USER_MISSING_DISPLAY_NAME)) {
      errors.displayName = errorMessage;
    } else if (hasErrorCode(updateUserError, ErrorCode.USER_INVALID_PASSWORD)) {
      errors.password = errorMessage;
    } else {
      globalErrorMessgae = errorMessage;
    }
  }

  let body: React.ReactNode | null = null;
  if (user != null) {
    body = (
      <UserForm
        user={user}
        onSubmit={(payload) =>
          updateUser({ currentUser: user, formPayload: payload })
        }
        pending={isUpdateUserLoading}
        errors={errors}
      />
    );
  } else if (isUserLoading) {
    body = <UserFormPlaceholder />;
  }

  return (
    <AsideLayout>
      <Header>
        <HeaderBackLink href=".." />
        <AsideHeaderTitle>{headerTitle}</AsideHeaderTitle>
        <HeaderCloseLink href="../.." />
      </Header>

      <PageTitle title={pageTitle} />

      <Aside className="px-4">
        {globalErrorMessgae != null && (
          <Message type="error" className="mb-2">
            {globalErrorMessgae}
          </Message>
        )}

        {userError != null && (
          <Message type="error" className="mb-4">
            {getErrorMessage(userError)}
          </Message>
        )}

        {body}
      </Aside>
    </AsideLayout>
  );
};

EditUserPage.resourcePermissionKey = "user";
EditUserPage.WrapperComponent = UsersPage;

export default EditUserPage;
