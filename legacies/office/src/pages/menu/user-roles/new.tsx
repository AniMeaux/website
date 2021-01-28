import { getErrorMessage } from "@animeaux/shared-entities";
import * as React from "react";
import { PageComponent } from "../../../core/pageComponent";
import { UserRoleForm } from "../../../core/userRole/userRoleForm";
import { useCreateUserRole } from "../../../core/userRole/userRoleQueries";
import { Aside, AsideLayout } from "../../../ui/layouts/aside";
import {
  AsideHeaderTitle,
  Header,
  HeaderCloseLink,
  HeaderPlaceholder,
} from "../../../ui/layouts/header";
import { PageTitle } from "../../../ui/layouts/page";
import { UserRolesPage } from "./index";

const NewUserRolePage: PageComponent = () => {
  const [createUserRole, createUserRoleRequest] = useCreateUserRole();

  return (
    <AsideLayout>
      <Header>
        <HeaderPlaceholder />
        <AsideHeaderTitle>Nouveau rôle utilisateur</AsideHeaderTitle>
        <HeaderCloseLink href=".." />
      </Header>

      <PageTitle title="Nouveau rôle utilisateur" />

      <Aside>
        <UserRoleForm
          onSubmit={createUserRole}
          pending={createUserRoleRequest.isLoading}
          errors={{
            name:
              createUserRoleRequest.error == null
                ? null
                : getErrorMessage(createUserRoleRequest.error),
          }}
          className="px-4"
        />
      </Aside>
    </AsideLayout>
  );
};

NewUserRolePage.resourcePermissionKey = "user_role";
NewUserRolePage.WrapperComponent = UserRolesPage;

export default NewUserRolePage;
