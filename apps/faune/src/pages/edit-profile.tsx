import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { useCurrentUser } from "account/currentUser";
import { Adornment } from "core/formElements/adornment";
import { Field } from "core/formElements/field";
import { FieldMessage } from "core/formElements/fieldMessage";
import { Form } from "core/formElements/form";
import { Input } from "core/formElements/input";
import { Label } from "core/formElements/label";
import { SubmitButton } from "core/formElements/submitButton";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { PageTitle } from "core/pageTitle";
import { useMutation } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

const EditProfile: PageComponent = () => {
  const router = useRouter();
  const backUrl = (router.query.backUrl as string | null) ?? "/";

  const { currentUser, updateProfile } = useCurrentUser();
  const [displayName, setDisplayName] = useState(currentUser.displayName);

  const mutation = useMutation<boolean, Error, string>(
    async (displayName) => {
      if (currentUser.displayName !== displayName) {
        await updateProfile(displayName);
      }

      return true;
    },
    {
      errorCodesToIgnore: [ErrorCode.USER_MISSING_DISPLAY_NAME],

      onSuccess() {
        router.backIfPossible(backUrl);
      },
    }
  );

  let errorMessage: string | null = null;

  if (
    mutation.error != null &&
    hasErrorCode(mutation.error, ErrorCode.USER_MISSING_DISPLAY_NAME)
  ) {
    errorMessage = getErrorMessage(mutation.error);
  }

  return (
    <ApplicationLayout>
      <PageTitle />

      <Header>
        <HeaderBackLink href={backUrl} />
        <HeaderTitle>Profil</HeaderTitle>
      </Header>

      <Main>
        <Form
          onSubmit={() => mutation.mutate(displayName)}
          pending={mutation.isLoading}
        >
          <Field>
            <Label htmlFor="name" hasError={errorMessage != null}>
              Nom
            </Label>

            <Input
              name="name"
              id="name"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={setDisplayName}
              hasError={errorMessage != null}
              leftAdornment={
                <Adornment>
                  <FaUser />
                </Adornment>
              }
            />

            <FieldMessage errorMessage={errorMessage} />
          </Field>

          <SubmitButton loading={mutation.isLoading}>Modifier</SubmitButton>
        </Form>
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

export default EditProfile;
