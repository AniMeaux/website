import { getErrorMessage } from "@animeaux/shared";
import * as React from "react";
import { PageComponent } from "../../../core/pageComponent";
import { useCreateUserRole } from "../../../core/userRole/userRoleQueries";
import {
  Header,
  HeaderBackLink,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../../ui/layouts/header";
import { Main } from "../../../ui/layouts/main";
import { PageLayout } from "../../../ui/layouts/pageLayout";
import { UserRoleForm } from "../../../ui/ressourcesForm/userRoleForm";

const NewUserRolePage: PageComponent = () => {
  const [createUserRole, { pending, error }] = useCreateUserRole();

  return (
    <PageLayout
      header={
        <Header>
          <HeaderBackLink href=".." />
          <HeaderTitle>Nouveau rôle utilisateur</HeaderTitle>
          <HeaderPlaceholder />
        </Header>
      }
    >
      <Main>
        <UserRoleForm
          onSubmit={createUserRole}
          pending={pending}
          errors={{
            name: error == null ? null : getErrorMessage(error),
          }}
          className="px-4"
        />
      </Main>
    </PageLayout>
  );
};

NewUserRolePage.resourcePermissionKey = "user_role";

export default NewUserRolePage;
