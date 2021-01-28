import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { useRouter } from "next/router";
import * as React from "react";
import {
  HostFamilyForm,
  HostFamilyFormErrors,
  HostFamilyFormPlaceholder,
} from "../../../core/hostFamily/hostFamilyForm";
import {
  useHostFamily,
  useUpdateHostFamily,
} from "../../../core/hostFamily/hostFamilyQueries";
import { PageComponent } from "../../../core/pageComponent";
import { Aside, AsideLayout } from "../../../ui/layouts/aside";
import {
  AsideHeaderTitle,
  Header,
  HeaderBackLink,
  HeaderCloseLink,
} from "../../../ui/layouts/header";
import { PageTitle } from "../../../ui/layouts/page";
import { Placeholder } from "../../../ui/loaders/placeholder";
import { Message } from "../../../ui/message";
import { HostFamiliesPage } from "../index";

const EditHostFamilyPage: PageComponent = () => {
  const router = useRouter();
  const hostFamilyId = router.query.hostFamilyId as string;
  const [hostFamily, hostFamilyRequest] = useHostFamily(hostFamilyId);
  const [updateHostFamily, updateHostFamilyRequest] = useUpdateHostFamily();

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;
  if (hostFamily != null) {
    pageTitle = `Modifier ${hostFamily.name}`;
    headerTitle = hostFamily.name;
  } else if (hostFamilyRequest.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (hostFamilyRequest.error != null) {
    pageTitle = "Oups";
    headerTitle = "Oups";
  }

  const errors: HostFamilyFormErrors = {};
  let globalErrorMessgae: string | null = null;

  if (updateHostFamilyRequest.error != null) {
    const errorMessage = getErrorMessage(updateHostFamilyRequest.error);

    if (
      hasErrorCode(
        updateHostFamilyRequest.error,
        ErrorCode.HOST_FAMILY_MISSING_NAME
      )
    ) {
      errors.name = errorMessage;
    } else if (
      hasErrorCode(
        updateHostFamilyRequest.error,
        ErrorCode.HOST_FAMILY_MISSING_ADDRESS
      )
    ) {
      errors.address = errorMessage;
    } else if (
      hasErrorCode(
        updateHostFamilyRequest.error,
        ErrorCode.HOST_FAMILY_MISSING_PHONE
      )
    ) {
      errors.phone = errorMessage;
    } else {
      globalErrorMessgae = errorMessage;
    }
  }

  let body: React.ReactNode | null = null;
  if (hostFamily != null) {
    body = (
      <HostFamilyForm
        hostFamily={hostFamily}
        onSubmit={(formPayload) =>
          updateHostFamily({ currentHostFamily: hostFamily, formPayload })
        }
        pending={updateHostFamilyRequest.isLoading}
        errors={errors}
      />
    );
  } else if (hostFamilyRequest.isLoading) {
    body = <HostFamilyFormPlaceholder />;
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
        {globalErrorMessgae != null && (
          <Message type="error" className="mb-2">
            {globalErrorMessgae}
          </Message>
        )}

        {hostFamilyRequest.error != null && (
          <Message type="error" className="mb-4">
            {getErrorMessage(hostFamilyRequest.error)}
          </Message>
        )}

        {body}
      </Aside>
    </AsideLayout>
  );
};

EditHostFamilyPage.resourcePermissionKey = "host_family";
EditHostFamilyPage.WrapperComponent = HostFamiliesPage;

export default EditHostFamilyPage;
