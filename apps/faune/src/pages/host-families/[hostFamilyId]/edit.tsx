import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { PageTitle } from "core/pageTitle";
import { renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import {
  HostFamilyForm,
  HostFamilyFormErrors,
  HostFamilyFormPlaceholder,
} from "hostFamily/hostFamilyForm";
import {
  useHostFamily,
  useUpdateHostFamily,
} from "hostFamily/hostFamilyQueries";
import * as React from "react";

const HostFamilyEditPage: PageComponent = () => {
  const router = useRouter();
  const hostFamilyId = router.query.hostFamilyId as string;
  const query = useHostFamily(hostFamilyId);
  const [updateHostFamily, mutation] = useUpdateHostFamily({
    onSuccess() {
      router.backIfPossible("..");
    },
  });

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

  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (hostFamily) => hostFamily.name,
    renderPlaceholder: () => <HostFamilyFormPlaceholder />,
    renderEntity: (hostFamily) => (
      <HostFamilyForm
        hostFamily={hostFamily}
        onSubmit={(formPayload) =>
          updateHostFamily({ currentHostFamily: hostFamily, formPayload })
        }
        pending={mutation.isLoading}
        errors={errors}
      />
    ),
  });

  return (
    <ApplicationLayout>
      <PageTitle title={pageTitle} />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>{headerTitle}</HeaderTitle>
      </Header>

      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

HostFamilyEditPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default HostFamilyEditPage;
