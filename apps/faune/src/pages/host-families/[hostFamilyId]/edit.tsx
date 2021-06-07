import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { Navigation } from "ui/layouts/navigation";
import { PageComponent } from "core/types";
import { PageTitle } from "core/pageTitle";
import { renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import {
  HostFamilyForm,
  HostFamilyFormErrors,
  HostFamilyFormPlaceholder,
} from "entities/hostFamily/hostFamilyForm";
import {
  useHostFamily,
  useUpdateHostFamily,
} from "entities/hostFamily/hostFamilyQueries";
import * as React from "react";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "ui/layouts/header";
import { Main } from "ui/layouts/main";

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
