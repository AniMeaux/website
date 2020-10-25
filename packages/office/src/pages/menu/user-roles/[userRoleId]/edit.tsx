import { getErrorMessage } from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { PageComponent } from "../../../../core/pageComponent";
import {
  useUpdateUserRole,
  useUserRole,
} from "../../../../core/userRole/userRoleQueries";
import {
  Header,
  HeaderBackLink,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../../../ui/layouts/header";
import { Main } from "../../../../ui/layouts/main";
import { Placeholder } from "../../../../ui/loaders/placeholder";
import { ProgressBar } from "../../../../ui/loaders/progressBar";
import { Message } from "../../../../ui/message";
import {
  UserRoleForm,
  UserRoleFormPlaceholder,
} from "../../../../ui/ressourcesForm/userRoleForm";

const EditUserRolePage: PageComponent = () => {
  const router = useRouter();
  const userRoleId = router.query.userRoleId as string;
  const [userRole, userRoleState] = useUserRole(userRoleId);
  const [updateUserRole, updateUserRoleState] = useUpdateUserRole();

  let title: React.ReactNode | null = null;
  if (userRole != null) {
    title = userRole.name;
  } else if (userRoleState.pending) {
    title = <Placeholder preset="text" />;
  } else if (userRoleState.error != null) {
    title = "Oups";
  }

  let body: React.ReactNode | null = null;
  if (userRole != null) {
    body = (
      <UserRoleForm
        userRole={userRole}
        onSubmit={(payload) => updateUserRole(userRole, payload)}
        pending={updateUserRoleState.pending}
        errors={{
          name:
            updateUserRoleState.error == null
              ? null
              : getErrorMessage(updateUserRoleState.error),
        }}
      />
    );
  } else if (userRoleState.pending) {
    body = <UserRoleFormPlaceholder />;
  }

  return (
    <>
      <Header>
        <HeaderBackLink href=".." />
        <HeaderTitle>{title}</HeaderTitle>
        <HeaderPlaceholder />
      </Header>

      {(userRoleState.pending || updateUserRoleState.pending) && (
        <ProgressBar />
      )}

      <Main className="px-4">
        {userRoleState.error != null && (
          <Message type="error" className="mb-4">
            {getErrorMessage(userRoleState.error)}
          </Message>
        )}

        {body}
      </Main>
    </>
  );
};

EditUserRolePage.resourcePermissionKey = "user_role";

export default EditUserRolePage;
