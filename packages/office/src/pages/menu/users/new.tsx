import { ErrorCode, getErrorMessage, hasErrorCode } from "@animeaux/shared";
import * as React from "react";
import { PageComponent } from "../../../core/pageComponent";
import { UserForm, UserFormErrors } from "../../../core/user/userForm";
import { useCreateUser } from "../../../core/user/userQueries";
import { Aside, AsideLayout } from "../../../ui/layouts/aside";
import {
  AsideHeaderTitle,
  Header,
  HeaderCloseLink,
  HeaderPlaceholder,
} from "../../../ui/layouts/header";
import { PageTitle } from "../../../ui/layouts/page";
import { Message } from "../../../ui/message";
import { UsersPage } from "./index";

const NewUserPage: PageComponent = () => {
  const [createUser, createUserRequest] = useCreateUser();

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
      hasErrorCode(createUserRequest.error, ErrorCode.USER_MISSING_ROLE)
    ) {
      errors.role = errorMessage;
    } else {
      globalErrorMessgae = errorMessage;
    }
  }

  return (
    <AsideLayout>
      <Header>
        <HeaderPlaceholder />
        <AsideHeaderTitle>Nouvel utilisateur</AsideHeaderTitle>
        <HeaderCloseLink href=".." />
      </Header>

      <PageTitle title="Nouvel utilisateur" />

      <Aside className="px-4">
        {globalErrorMessgae != null && (
          <Message type="error" className="mb-2">
            {globalErrorMessgae}
          </Message>
        )}

        <UserForm
          onSubmit={createUser}
          pending={createUserRequest.isLoading}
          errors={errors}
        />
      </Aside>
    </AsideLayout>
  );
};

NewUserPage.resourcePermissionKey = "user";
NewUserPage.WrapperComponent = UsersPage;

export default NewUserPage;
