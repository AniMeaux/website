import { ErrorCodeLabels } from "@animeaux/shared";
import * as React from "react";
import { PageComponent } from "../../../core/pageComponent";
import { useCreateUserRole } from "../../../core/userRole";
import {
  Header,
  HeaderBackLink,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../../ui/layouts/header";
import { Main } from "../../../ui/layouts/main";
import { UserRoleForm } from "../../../ui/ressourcesForm/userRoleForm";

const NewUserRolePage: PageComponent = () => {
  const [onSubmit, { pending, error }] = useCreateUserRole();

  let errorMessage: string | null = null;
  if (error != null) {
    errorMessage = ErrorCodeLabels[error.message] ?? error.message;
  }

  return (
    <>
      <Header>
        <HeaderBackLink href="/menu/user-roles" />
        <HeaderTitle>Nouveau rôle utilisateur</HeaderTitle>
        <HeaderPlaceholder />
      </Header>

      <Main>
        <UserRoleForm
          onSubmit={onSubmit}
          pending={pending}
          errors={{ name: errorMessage }}
          className="px-4"
        />
      </Main>
    </>
  );
};

NewUserRolePage.resourcePermissionKey = "user_role";

export default NewUserRolePage;
