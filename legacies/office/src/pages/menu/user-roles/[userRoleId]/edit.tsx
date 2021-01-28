import { getErrorMessage } from "@animeaux/shared-entities";
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
  const [userRole, userRoleRequest] = useUserRole(userRoleId);
  const [updateUserRole, updateUserRoleRequest] = useUpdateUserRole();

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;
  if (userRole != null) {
    pageTitle = `Modifier ${userRole.name}`;
    headerTitle = userRole.name;
  } else if (userRoleRequest.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (userRoleRequest.error != null) {
    pageTitle = "Oups";
    headerTitle = "Oups";
  }

  let body: React.ReactNode | null = null;
  if (userRole != null) {
    body = (
      <UserRoleForm
        userRole={userRole}
        onSubmit={(formPayload) =>
          updateUserRole({ currentUserRole: userRole, formPayload })
        }
        pending={updateUserRoleRequest.isLoading}
        errors={{
          name:
            updateUserRoleRequest.error == null
              ? null
              : getErrorMessage(updateUserRoleRequest.error),
        }}
      />
    );
  } else if (userRoleRequest.isLoading) {
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
        {userRoleRequest.error != null && (
          <Message type="error" className="mb-4">
            {getErrorMessage(userRoleRequest.error)}
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
