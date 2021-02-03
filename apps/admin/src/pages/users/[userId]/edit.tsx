import {
  Header,
  PageComponent,
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
import { Main, Placeholder, resolveUrl } from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { PageTitle } from "../../../core/pageTitle";

const UserEditPage: PageComponent = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const [user, query] = useUser(userId);
  const [updateUser, mutation] = useUpdateUser({
    onSuccess() {
      router.push(resolveUrl(router.asPath, ".."));
    },
  });

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;

  if (user != null) {
    pageTitle = `Modifier : ${user.displayName}`;
    headerTitle = pageTitle;
  } else if (query.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (query.error != null) {
    headerTitle = "Oups";
    pageTitle = "Oups";
  }

  const errors: UserFormErrors = {};

  if (mutation.error != null) {
    const errorMessage = getErrorMessage(mutation.error);

    if (hasErrorCode(mutation.error, ErrorCode.USER_MISSING_DISPLAY_NAME)) {
      errors.displayName = errorMessage;
    } else if (hasErrorCode(mutation.error, ErrorCode.USER_INVALID_PASSWORD)) {
      errors.password = errorMessage;
    } else if (
      hasErrorCode(mutation.error, [
        ErrorCode.USER_MISSING_GROUP,
        ErrorCode.USER_IS_ADMIN,
      ])
    ) {
      errors.groups = errorMessage;
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
        pending={mutation.isLoading}
        errors={errors}
      />
    );
  } else if (query.isLoading) {
    content = <UserFormPlaceholder />;
  }

  return (
    <div>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack />
      <Main>{content}</Main>
    </div>
  );
};

export default UserEditPage;
