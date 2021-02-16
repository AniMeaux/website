import {
  Header,
  HostFamilyForm,
  HostFamilyFormErrors,
  HostFamilyFormPlaceholder,
  PageComponent,
  useHostFamily,
  useUpdateHostFamily,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { Main, Placeholder, resolveUrl } from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { PageTitle } from "../../../core/pageTitle";

const HostFamilyEditPage: PageComponent = () => {
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
    pageTitle = hostFamily.name;
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
      hasErrorCode(mutation.error, ErrorCode.HOST_FAMILY_MISSING_ZIP_CODE)
    ) {
      errors.zipCode = errorMessage;
    } else if (
      hasErrorCode(mutation.error, ErrorCode.HOST_FAMILY_MISSING_CITY)
    ) {
      errors.city = errorMessage;
    } else if (
      hasErrorCode(mutation.error, ErrorCode.HOST_FAMILY_MISSING_ADDRESS)
    ) {
      errors.address = errorMessage;
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
};

HostFamilyEditPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default HostFamilyEditPage;
