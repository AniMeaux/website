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
import { Main, Placeholder, resolveUrl } from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { PageTitle } from "../../../core/pageTitle";

export default function HostFamilyEditPage() {
  const router = useRouter();
  const hostFamilyId = router.query.hostFamilyId as string;
  const [hostFamily, query] = useHostFamily(hostFamilyId);
  const [updateHostFamily, mutation] = useUpdateHostFamily({
    onSuccess() {
      router.push(resolveUrl(router.asPath, ".."));
    },
  });

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;

  if (hostFamily != null) {
    pageTitle = `Modifier : ${hostFamily.name}`;
    headerTitle = pageTitle;
  } else if (query.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (query.error != null) {
    headerTitle = "Oups";
    pageTitle = "Oups";
  }

  const errors: HostFamilyFormErrors = {};

  if (mutation.error != null) {
    const errorMessage = getErrorMessage(mutation.error);

    if (
      hasErrorCode(mutation.error, [
        ErrorCode.HOST_FAMILY_MISSING_NAME,
        ErrorCode.HOST_FAMILY_NAME_ALREADY_USED,
      ])
    ) {
      errors.name = errorMessage;
    } else if (
      hasErrorCode(mutation.error, ErrorCode.HOST_FAMILY_MISSING_PHONE)
    ) {
      errors.phone = errorMessage;
    } else if (
      hasErrorCode(mutation.error, ErrorCode.HOST_FAMILY_INVALID_EMAIL)
    ) {
      errors.email = errorMessage;
    } else if (
      hasErrorCode(mutation.error, ErrorCode.HOST_FAMILY_MISSING_ADDRESS)
    ) {
      errors.address = errorMessage;
    } else if (
      hasErrorCode(mutation.error, ErrorCode.HOST_FAMILY_MISSING_HOUSING)
    ) {
      errors.housing = errorMessage;
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
        pending={mutation.isLoading}
        errors={errors}
      />
    );
  } else if (query.isLoading) {
    content = <HostFamilyFormPlaceholder />;
  }

  return (
    <div>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack />
      <Main>{content}</Main>
    </div>
  );
}
