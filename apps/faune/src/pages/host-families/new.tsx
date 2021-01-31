import {
  Header,
  HostFamilyForm,
  HostFamilyFormErrors,
  useCreateHostFamily,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { Main, resolveUrl } from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { PageTitle } from "../../core/pageTitle";

export default function CreateHostFamilyPage() {
  const router = useRouter();
  const [createHostFamily, { error, isLoading }] = useCreateHostFamily({
    onSuccess() {
      router.push(resolveUrl(router.asPath, ".."));
    },
  });

  const errors: HostFamilyFormErrors = {};

  if (error != null) {
    const errorMessage = getErrorMessage(error);

    if (
      hasErrorCode(error, [
        ErrorCode.HOST_FAMILY_MISSING_NAME,
        ErrorCode.HOST_FAMILY_NAME_ALREADY_USED,
      ])
    ) {
      errors.name = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.HOST_FAMILY_MISSING_PHONE)) {
      errors.phone = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.HOST_FAMILY_INVALID_EMAIL)) {
      errors.email = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.HOST_FAMILY_MISSING_ADDRESS)) {
      errors.address = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.HOST_FAMILY_MISSING_HOUSING)) {
      errors.housing = errorMessage;
    }
  }

  return (
    <div>
      <PageTitle title="Nouvelle FA" />
      <Header headerTitle="Nouvelle FA" canGoBack />

      <Main>
        <HostFamilyForm
          onSubmit={createHostFamily}
          pending={isLoading}
          errors={errors}
        />
      </Main>
    </div>
  );
}
