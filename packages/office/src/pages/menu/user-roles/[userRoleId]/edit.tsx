import { getErrorMessage } from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { PageComponent } from "../../../../core/pageComponent";
import {
  UserRoleForm,
  UserRoleFormPlaceholder,
} from "../../../../core/userRole/userRoleForm";
import {
  useUpdateUserRole,
  useUserRole,
} from "../../../../core/userRole/userRoleQueries";
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
import { UserRolesPage } from "../index";

const EditUserRolePage: PageComponent = () => {
  const router = useRouter();
  const userRoleId = router.query.userRoleId as string;
  const { userRole, ...userRoleState } = useUserRole(userRoleId);
  const [updateUserRole, updateUserRoleState] = useUpdateUserRole();

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;
  if (userRole != null) {
    pageTitle = `Modifier ${userRole.name}`;
    headerTitle = userRole.name;
  } else if (userRoleState.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (userRoleState.error != null) {
    pageTitle = "Oups";
    headerTitle = "Oups";
  }

  let body: React.ReactNode | null = null;
  if (userRole != null) {
    body = (
      <UserRoleForm
        userRole={userRole}
        onSubmit={(payload) =>
          updateUserRole({ currentUserRole: userRole, formPayload: payload })
        }
        pending={updateUserRoleState.isLoading}
        errors={{
          name:
            updateUserRoleState.error == null
              ? null
              : getErrorMessage(updateUserRoleState.error),
        }}
      />
    );
  } else if (userRoleState.isLoading) {
    body = <UserRoleFormPlaceholder />;
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
        {userRoleState.error != null && (
          <Message type="error" className="mb-4">
            {getErrorMessage(userRoleState.error)}
          </Message>
        )}

        {body}
      </Aside>
    </AsideLayout>
  );
};

EditUserRolePage.resourcePermissionKey = "user_role";
EditUserRolePage.WrapperComponent = UserRolesPage;

export default EditUserRolePage;
