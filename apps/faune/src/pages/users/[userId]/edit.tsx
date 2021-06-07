import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { Navigation } from "ui/layouts/navigation";
import { PageComponent } from "core/types";
import { PageTitle } from "core/pageTitle";
import { renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import {
  UserForm,
  UserFormErrors,
  UserFormPlaceholder,
} from "entities/user/userForm";
import { useUpdateUser, useUser } from "entities/user/userQueries";
import * as React from "react";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "ui/layouts/header";
import { Main } from "ui/layouts/main";

const UserEditPage: PageComponent = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const query = useUser(userId);
  const [updateUser, mutation] = useUpdateUser({
    onSuccess() {
      router.backIfPossible("..");
    },
  });

  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (user) => user.displayName,
    renderPlaceholder: () => <UserFormPlaceholder />,
    renderEntity: (user) => (
      <UserForm
        user={user}
        onSubmit={(formPayload) =>
          updateUser({ currentUser: user, formPayload })
        }
        pending={mutation.isLoading}
        errors={errors}
      />
    ),
  });

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

  return (
    <ApplicationLayout>
      <PageTitle title={pageTitle} />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>{headerTitle}</HeaderTitle>
      </Header>

      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

UserEditPage.authorisedGroups = [UserGroup.ADMIN];

export default UserEditPage;
