import { getErrorMessage } from "@animeaux/shared";
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
import { UserRolesPage } from "./index";

const NewUserRolePage: PageComponent = () => {
  const [createUserRole, { isLoading, error }] = useCreateUserRole();

  return (
    <AsideLayout>
      <Header>
        <HeaderPlaceholder />
        <AsideHeaderTitle>Nouveau rôle utilisateur</AsideHeaderTitle>
        <HeaderCloseLink href=".." />
      </Header>

      <Aside>
        <UserRoleForm
          onSubmit={createUserRole}
          pending={isLoading}
          errors={{
            name: error == null ? null : getErrorMessage(error),
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
