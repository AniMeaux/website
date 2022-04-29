import { CurrentUser } from "@animeaux/shared";
import { useCurrentUser } from "account/currentUser";
import { Info } from "core/dataDisplay/info";
import { Adornment } from "core/formElements/adornment";
import { Field, Fields } from "core/formElements/field";
import { Form } from "core/formElements/form";
import { Input } from "core/formElements/input";
import { Label } from "core/formElements/label";
import { SubmitButton } from "core/formElements/submitButton";
import { BaseValidationError } from "core/formValidation";
import { includes } from "core/includes";
import { joinReactNodes } from "core/joinReactNodes";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { useOperationMutation } from "core/operations";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent, SetStateAction } from "core/types";
import invariant from "invariant";
import without from "lodash.without";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { string } from "yup";

type ErrorCode = "server-error" | "empty-display-name";

class ValidationError extends BaseValidationError<ErrorCode> {}

const ERROR_CODE_LABEL: Record<ErrorCode, string> = {
  "server-error": "Une erreur est survenue.",
  "empty-display-name": "Le nom est obligatoire.",
};

type FormState = {
  displayName: string;
  errors: ErrorCode[];
};

type FormValue = Omit<FormState, "errors">;

const EditProfile: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.backUrl === "string" ||
      typeof router.query.backUrl === "undefined",
    `The backUrl path should be undefined or a string. Got '${typeof router
      .query.backUrl}'`
  );

  const backUrl = router.query.backUrl ?? "/";
  const { currentUser } = useCurrentUser();
  const [state, setState] = useState(initializeState(currentUser));

  const updateCurrentUserProfile = useOperationMutation(
    "updateCurrentUserProfile",
    {
      onSuccess: (response, cache) => {
        cache.set({ name: "getCurrentUser" }, response.result);

        // Invalidate instead of set because these cached results might not
        // exists for non authorised users.
        cache.invalidate({ name: "getAllUsers" });
        cache.invalidate({
          name: "getUser",
          params: { id: response.result.id },
        });

        router.backIfPossible(backUrl);
      },
    }
  );

  async function handleSubmit() {
    if (updateCurrentUserProfile.state !== "loading") {
      try {
        updateCurrentUserProfile.mutate(validate(state));
      } catch (error) {
        invariant(
          error instanceof ValidationError,
          "The error is expected to be a ValidationError error"
        );

        setState(setErrors(error.codes));
      }
    }
  }

  const errors = [...state.errors];
  if (updateCurrentUserProfile.state === "error") {
    errors.push("server-error");
  }

  return (
    <ApplicationLayout>
      <PageTitle />

      <Header>
        <HeaderBackLink href={backUrl} />
        <HeaderTitle>Profil</HeaderTitle>
      </Header>

      <Main>
        <Form onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <Info variant="error">
              {joinReactNodes(
                errors.map((error) => ERROR_CODE_LABEL[error]),
                <br />
              )}
            </Info>
          )}

          <Fields>
            <Field>
              <Label
                htmlFor="name"
                hasError={includes(errors, "empty-display-name")}
              >
                Nom
              </Label>

              <Input
                name="name"
                id="name"
                type="text"
                autoComplete="name"
                value={state.displayName}
                onChange={(displayName) =>
                  setState(setDisplayName(displayName))
                }
                hasError={includes(errors, "empty-display-name")}
                leftAdornment={
                  <Adornment>
                    <FaUser />
                  </Adornment>
                }
              />
            </Field>
          </Fields>

          <SubmitButton loading={updateCurrentUserProfile.state === "loading"}>
            Modifier
          </SubmitButton>
        </Form>
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

export default EditProfile;

function initializeState(currentUser: CurrentUser) {
  return (): FormState => ({
    displayName: currentUser.displayName,
    errors: [],
  });
}

function setDisplayName(displayName: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    displayName,
    errors: without(prevState.errors, "empty-display-name"),
  });
}

function setErrors(errors: ErrorCode[]): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, errors });
}

function validate(state: FormState): FormValue {
  const errorCodes: ErrorCode[] = [];

  if (!string().trim().required().isValidSync(state.displayName)) {
    errorCodes.push("empty-display-name");
  }

  if (errorCodes.length > 0) {
    throw new ValidationError(errorCodes);
  }

  return { displayName: state.displayName };
}
