import {
  Header,
  PageComponent,
  useCreateUser,
  UserForm,
  UserFormErrors,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { Main, useRouter } from "@animeaux/ui-library";
import * as React from "react";
import { PageTitle } from "../../core/pageTitle";

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
    <div>
      <PageTitle title="Nouvel utilisateur" />
      <Header headerTitle="Nouvel utilisateur" canGoBack />

      <Main>
        <UserForm onSubmit={createUser} pending={isLoading} errors={errors} />
      </Main>
    </div>
  );
};

export default CreateUserPage;
