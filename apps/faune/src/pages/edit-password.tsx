import { OperationResult, PickOperationErrorResult } from "@animeaux/shared";
import invariant from "invariant";
import without from "lodash.without";
import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { string } from "yup";
import { Info } from "~/core/dataDisplay/info";
import { Adornment } from "~/core/formElements/adornment";
import { Field, Fields } from "~/core/formElements/field";
import { Form } from "~/core/formElements/form";
import { Label } from "~/core/formElements/label";
import { PasswordInput } from "~/core/formElements/passwordInput";
import { SubmitButton } from "~/core/formElements/submitButton";
import { BaseValidationError } from "~/core/formValidation";
import { includes } from "~/core/includes";
import { joinReactNodes } from "~/core/joinReactNodes";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { useOperationMutation } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useRouter } from "~/core/router";
import { PageComponent, SetStateAction } from "~/core/types";

type ErrorCode =
  | PickOperationErrorResult<
      OperationResult<"updateCurrentUserPassword">
    >["code"]
  | "server-error"
  | "empty-password"
  | "week-password";

class ValidationError extends BaseValidationError<ErrorCode> {}

const ERROR_CODE_LABEL: Record<ErrorCode, string> = {
  "server-error": "Une erreur est survenue.",
  "empty-password": "Le mot de passe doit avoir au moins 6 caractères.",
  "week-password": "Le mot de passe doit avoir au moins 6 caractères.",
};

type FormState = {
  password: string;
  errors: ErrorCode[];
};

const INITIAL_STATE: FormState = {
  password: "",
  errors: [],
};

type FormValue = Omit<FormState, "errors">;

const EditPassword: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.backUrl === "string" ||
      typeof router.query.backUrl === "undefined",
    `The backUrl path should be undefined or a string. Got '${typeof router
      .query.backUrl}'`
  );

  const backUrl = router.query.backUrl ?? "/";
  const [state, setState] = useState(INITIAL_STATE);

  const updateCurrentUserPassword = useOperationMutation(
    "updateCurrentUserPassword",
    { onSuccess: () => router.backIfPossible(backUrl) }
  );

  async function handleSubmit() {
    if (updateCurrentUserPassword.state !== "loading") {
      try {
        updateCurrentUserPassword.mutate(validate(state));
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
  if (updateCurrentUserPassword.state === "error") {
    errors.push(updateCurrentUserPassword.errorResult?.code ?? "server-error");
  }

  return (
    <ApplicationLayout>
      <PageTitle title="Mot de passe" />

      <Header>
        <HeaderBackLink href={backUrl} />
        <HeaderTitle>Mot de passe</HeaderTitle>
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
                htmlFor="new-password"
                hasError={includes(errors, "empty-password", "week-password")}
              >
                Nouveau mot de passe
              </Label>

              <PasswordInput
                name="new-password"
                id="new-password"
                autoComplete="new-password"
                value={state.password}
                onChange={(password) => setState(setPassword(password))}
                hasError={includes(errors, "empty-password", "week-password")}
                leftAdornment={
                  <Adornment>
                    <FaLock />
                  </Adornment>
                }
              />
            </Field>
          </Fields>

          <SubmitButton loading={updateCurrentUserPassword.state === "loading"}>
            Modifier
          </SubmitButton>
        </Form>
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

export default EditPassword;

function setPassword(password: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    password,
    errors: without(prevState.errors, "empty-password", "week-password"),
  });
}

function setErrors(errors: ErrorCode[]): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, errors });
}

function validate(state: FormState): FormValue {
  const errorCodes: ErrorCode[] = [];

  if (!string().required().isValidSync(state.password)) {
    errorCodes.push("empty-password");
  } else if (!string().min(6).isValidSync(state.password)) {
    errorCodes.push("week-password");
  }

  if (errorCodes.length > 0) {
    throw new ValidationError(errorCodes);
  }

  return { password: state.password };
}
