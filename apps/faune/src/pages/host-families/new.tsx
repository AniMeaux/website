import {
  HostFamilyForm,
  HostFamilyFormErrors,
  useCreateHostFamily,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { Main, Message, resolveUrl } from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { Header } from "../../core/header";
import { PageTitle } from "../../core/pageTitle";

export default function CreateHostFamilyPage() {
  const router = useRouter();
  const [createHostFamily, createHostFamilyRequest] = useCreateHostFamily(
    () => {
      router.push(resolveUrl(router.asPath, "../?creationSucceeded"));
    }
  );

  const errors: HostFamilyFormErrors = {};
  let globalErrorMessgae: string | null = null;

  if (createHostFamilyRequest.error != null) {
    const errorMessage = getErrorMessage(createHostFamilyRequest.error);

    if (
      hasErrorCode(createHostFamilyRequest.error, [
        ErrorCode.HOST_FAMILY_MISSING_NAME,
        ErrorCode.HOST_FAMILY_NAME_ALREADY_USED,
      ])
    ) {
      errors.name = errorMessage;
    } else if (
      hasErrorCode(
        createHostFamilyRequest.error,
        ErrorCode.HOST_FAMILY_MISSING_PHONE
      )
    ) {
      errors.phone = errorMessage;
    } else if (
      hasErrorCode(
        createHostFamilyRequest.error,
        ErrorCode.HOST_FAMILY_INVALID_EMAIL
      )
    ) {
      errors.email = errorMessage;
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
        ErrorCode.HOST_FAMILY_MISSING_HOUSING
      )
    ) {
      errors.housing = errorMessage;
    } else {
      globalErrorMessgae = errorMessage;
    }
  }

  return (
    <div>
      <PageTitle title="Nouvelle FA" />
      <Header headerTitle="Nouvelle FA" canGoBack />

      <Main>
        {globalErrorMessgae != null && (
          <Message type="error" className="mx-4 mb-4">
            {globalErrorMessgae}
          </Message>
        )}

        <HostFamilyForm
          onSubmit={createHostFamily}
          pending={createHostFamilyRequest.isLoading}
          errors={errors}
        />
      </Main>

      {/* <Navigation hideOnSmallScreen /> */}
    </div>
  );
}
