import {
  Header,
  HostFamilyForm,
  HostFamilyFormErrors,
  HostFamilyFormPlaceholder,
  useHostFamily,
  useUpdateHostFamily,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { Main, Message, Placeholder, resolveUrl } from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { PageTitle } from "../../../core/pageTitle";

export default function HostFamilyEditPage() {
  const router = useRouter();
  const hostFamilyId = router.query.hostFamilyId as string;
  const [hostFamily, hostFamilyRequest] = useHostFamily(hostFamilyId);
  const [updateHostFamily, updateHostFamilyRequest] = useUpdateHostFamily(
    () => {
      router.push(resolveUrl(router.asPath, "..?updateSucceeded"));
    }
  );

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;

  if (hostFamily != null) {
    pageTitle = `Modifier : ${hostFamily.name}`;
    headerTitle = pageTitle;
  } else if (hostFamilyRequest.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (hostFamilyRequest.error != null) {
    headerTitle = "Oups";
    pageTitle = "Oups";
  }

  const errors: HostFamilyFormErrors = {};
  let globalErrorMessgae: string | null = null;

  if (updateHostFamilyRequest.error != null) {
    const errorMessage = getErrorMessage(updateHostFamilyRequest.error);

    if (
      hasErrorCode(updateHostFamilyRequest.error, [
        ErrorCode.HOST_FAMILY_MISSING_NAME,
        ErrorCode.HOST_FAMILY_NAME_ALREADY_USED,
      ])
    ) {
      errors.name = errorMessage;
    } else if (
      hasErrorCode(
        updateHostFamilyRequest.error,
        ErrorCode.HOST_FAMILY_MISSING_PHONE
      )
    ) {
      errors.phone = errorMessage;
    } else if (
      hasErrorCode(
        updateHostFamilyRequest.error,
        ErrorCode.HOST_FAMILY_INVALID_EMAIL
      )
    ) {
      errors.email = errorMessage;
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
        ErrorCode.HOST_FAMILY_MISSING_HOUSING
      )
    ) {
      errors.housing = errorMessage;
    } else {
      globalErrorMessgae = errorMessage;
    }
  }

  let content: React.ReactNode | null = null;

  if (hostFamily != null) {
    content = (
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
    content = <HostFamilyFormPlaceholder />;
  }

  return (
    <div>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack />

      <Main>
        {globalErrorMessgae != null && (
          <Message type="error" className="mx-4 mb-4">
            {globalErrorMessgae}
          </Message>
        )}

        {hostFamilyRequest.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(hostFamilyRequest.error)}
          </Message>
        )}

        {content}
      </Main>

      {/* <Navigation hideOnSmallScreen /> */}
    </div>
  );
}
