import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import * as React from "react";
import {
  HostFamilyForm,
  HostFamilyFormErrors,
} from "../../core/hostFamily/hostFamilyForm";
import { useCreateHostFamily } from "../../core/hostFamily/hostFamilyQueries";
import { PageComponent } from "../../core/pageComponent";
import { Aside, AsideLayout } from "../../ui/layouts/aside";
import {
  AsideHeaderTitle,
  Header,
  HeaderCloseLink,
  HeaderPlaceholder,
} from "../../ui/layouts/header";
import { PageTitle } from "../../ui/layouts/page";
import { Message } from "../../ui/message";
import { HostFamiliesPage } from "./index";

const NewHostFamilyPage: PageComponent = () => {
  const [createHostFamily, createHostFamilyRequest] = useCreateHostFamily();

  const errors: HostFamilyFormErrors = {};
  let globalErrorMessgae: string | null = null;

  if (createHostFamilyRequest.error != null) {
    const errorMessage = getErrorMessage(createHostFamilyRequest.error);

    if (
      hasErrorCode(
        createHostFamilyRequest.error,
        ErrorCode.HOST_FAMILY_MISSING_NAME
      )
    ) {
      errors.name = errorMessage;
    } else if (
      hasErrorCode(
        createHostFamilyRequest.error,
        ErrorCode.HOST_FAMILY_MISSING_ADDRESS
      )
    ) {
      errors.address = errorMessage;
    } else if (
      hasErrorCode(
        createHostFamilyRequest.error,
        ErrorCode.HOST_FAMILY_MISSING_PHONE
      )
    ) {
      errors.phone = errorMessage;
    } else {
      globalErrorMessgae = errorMessage;
    }
  }

  return (
    <AsideLayout>
      <Header>
        <HeaderPlaceholder />
        <AsideHeaderTitle>Nouvelle famille d'accueil</AsideHeaderTitle>
        <HeaderCloseLink href=".." />
      </Header>

      <PageTitle title="Nouvelle famille d'accueil" />

      <Aside className="px-4">
        {globalErrorMessgae != null && (
          <Message type="error" className="mb-2">
            {globalErrorMessgae}
          </Message>
        )}

        <HostFamilyForm
          onSubmit={createHostFamily}
          pending={createHostFamilyRequest.isLoading}
          errors={errors}
        />
      </Aside>
    </AsideLayout>
  );
};

NewHostFamilyPage.resourcePermissionKey = "host_family";
NewHostFamilyPage.WrapperComponent = HostFamiliesPage;

export default NewHostFamilyPage;
