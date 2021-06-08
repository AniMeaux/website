import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import { UserForm, UserFormErrors } from "entities/user/userForm";
import { useCreateUser } from "entities/user/userQueries";
import { ApplicationLayout } from "layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "layouts/header";
import { Main } from "layouts/main";
import { Navigation } from "layouts/navigation";
import * as React from "react";

const CreateUserPage: PageComponent = () => {
  const router = useRouter();
  const [createUser, { error, isLoading }] = useCreateUser({
    onSuccess() {
      router.backIfPossible("..");
    },
  });

  const errors: UserFormErrors = {};

  if (error != null) {
    const errorMessage = getErrorMessage(error);

    if (hasErrorCode(error, ErrorCode.USER_MISSING_DISPLAY_NAME)) {
      errors.displayName = errorMessage;
    } else if (
      hasErrorCode(error, [
        ErrorCode.USER_EMAIL_ALREADY_EXISTS,
        ErrorCode.USER_INVALID_EMAIL,
      ])
    ) {
      errors.email = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.USER_INVALID_PASSWORD)) {
      errors.password = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.USER_MISSING_GROUP)) {
      errors.groups = errorMessage;
    }
  }

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvel utilisateur" />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>Nouvel utilisateur</HeaderTitle>
      </Header>

      <Main>
        <UserForm onSubmit={createUser} pending={isLoading} errors={errors} />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateUserPage.authorisedGroups = [UserGroup.ADMIN];

export default CreateUserPage;
