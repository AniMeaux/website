import invariant from "invariant";
import uniq from "lodash.uniq";
import without from "lodash.without";
import { useState } from "react";
import { FaCheckCircle, FaEnvelope, FaLock } from "react-icons/fa";
import { useMutation } from "react-query";
import styled, { keyframes } from "styled-components";
import { string } from "yup";
import { Info } from "~/core/dataDisplay/info";
import { firebase, isFirebaseError } from "~/core/firebase";
import { Adornment } from "~/core/formElements/adornment";
import { Field, Fields } from "~/core/formElements/field";
import { Form as BaseForm } from "~/core/formElements/form";
import { Input } from "~/core/formElements/input";
import { Label } from "~/core/formElements/label";
import { PasswordInput } from "~/core/formElements/passwordInput";
import { SubmitButton } from "~/core/formElements/submitButton";
import { BaseValidationError } from "~/core/formValidation";
import { AppIcon } from "~/core/icons/appIcon";
import { includes } from "~/core/includes";
import { joinReactNodes } from "~/core/joinReactNodes";
import { PageTitle } from "~/core/pageTitle";
import { ScreenSize, useScreenSize } from "~/core/screenSize";
import { SetStateAction } from "~/core/types";
import { theme } from "~/styles/theme";

type ErrorCode = "server-error" | "invalid-credentials";

class ValidationError extends BaseValidationError<ErrorCode> {}

const ERROR_CODE_LABEL: Record<ErrorCode, string> = {
  "server-error": "Une erreur est survenue, veuillez réessayer ultérieurement.",
  "invalid-credentials": "Identifiants invalides.",
};

type FormState = {
  email: string;
  password: string;
  errors: ErrorCode[];
};

const INITIAL_STATE: FormState = {
  email: "",
  password: "",
  errors: [],
};

type FormValue = Omit<FormState, "errors">;

const INVALID_CREDENTIALS_ERROR_CODES = [
  "auth/invalid-email",
  "auth/user-disabled",
  "auth/user-not-found",
  "auth/wrong-password",
];

export function SignInPage() {
  const [state, setState] = useState(INITIAL_STATE);

  const signIn = useMutation<void, Error, FormValue>(
    async ({ email, password }) => {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    }
  );

  async function handleSubmit() {
    if (!signIn.isLoading) {
      try {
        signIn.mutate(validate(state));
      } catch (error) {
        invariant(
          error instanceof ValidationError,
          "The error is expected to be a ValidationError error"
        );

        setState(setErrors(error.codes));
      }
    }
  }

  const { screenSize } = useScreenSize();

  let errors = [...state.errors];
  if (signIn.status === "error") {
    if (
      isFirebaseError(signIn.error) &&
      INVALID_CREDENTIALS_ERROR_CODES.includes(signIn.error.code)
    ) {
      errors.push("invalid-credentials");
    } else {
      errors.push("server-error");
    }
  }

  errors = uniq(errors);

  return (
    <>
      <PageTitle title="Connection" />

      <Container>
        {screenSize >= ScreenSize.LARGE && <Image />}

        <Main>
          <Form onSubmit={handleSubmit}>
            <Logo />

            <Title>Bienvenue</Title>

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
                  htmlFor="email"
                  hasError={includes(errors, "invalid-credentials")}
                >
                  Email
                </Label>

                <Input
                  name="email"
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={state.email}
                  onChange={(email) => setState(setEmail(email))}
                  hasError={includes(errors, "invalid-credentials")}
                  leftAdornment={
                    <Adornment>
                      <FaEnvelope />
                    </Adornment>
                  }
                />
              </Field>

              <Field>
                <Label
                  htmlFor="password"
                  hasError={includes(errors, "invalid-credentials")}
                >
                  Mot de passe
                </Label>

                <PasswordInput
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  value={state.password}
                  onChange={(password) => setState(setPassword(password))}
                  hasError={includes(errors, "invalid-credentials")}
                  leftAdornment={
                    <Adornment>
                      <FaLock />
                    </Adornment>
                  }
                />
              </Field>
            </Fields>

            {signIn.status === "success" ? (
              <SuccessIcon>
                <FaCheckCircle />
              </SuccessIcon>
            ) : (
              <SubmitButton loading={signIn.status === "loading"}>
                Se connecter
              </SubmitButton>
            )}
          </Form>
        </Main>
      </Container>
    </>
  );
}

function setEmail(email: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    email,
    errors: without(prevState.errors, "invalid-credentials"),
  });
}

function setPassword(password: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    password,
    errors: without(prevState.errors, "invalid-credentials"),
  });
}

function setErrors(errors: ErrorCode[]): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, errors });
}

function validate(state: FormState): FormValue {
  const errorCodes: ErrorCode[] = [];

  if (!string().trim().email().required().isValidSync(state.email)) {
    errorCodes.push("invalid-credentials");
  } else if (!string().min(6).required().isValidSync(state.password)) {
    errorCodes.push("invalid-credentials");
  }

  if (errorCodes.length > 0) {
    throw new ValidationError(errorCodes);
  }

  return { email: state.email, password: state.password };
}

const Container = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${theme.screenSizes.large.start}) {
    flex-direction: row;
  }
`;

const ImageAnimation = keyframes`
  0% {
    background-position: 0% 100%;
  }

  25% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 100% 0%;
  }

  75% {
    background-position: 100% 100%;
  }

  100% {
    background-position: 0% 100%;
  }
`;

const Image = styled.div`
  min-height: 100vh;
  flex: 1;
  clip-path: ellipse(75% 200% at 25% 50%);
  background-image: linear-gradient(
      0deg,
      ${theme.colors.blue[500]} 0%,
      transparent 60%
    ),
    linear-gradient(90deg, ${theme.colors.green[500]} 0%, transparent 60%),
    linear-gradient(135deg, ${theme.colors.amber[500]} 0%, transparent 60%),
    linear-gradient(225deg, ${theme.colors.red[500]} 0%, transparent 60%),
    linear-gradient(270deg, ${theme.colors.lightBlue[500]} 0%, transparent 60%);
  background-size: 200% 200%;
  animation: ${ImageAnimation};
  animation-timing-function: linear;
  animation-duration: 20s;
  animation-iteration-count: infinite;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  padding-top: ${theme.spacing.x8};

  @media (min-width: ${theme.screenSizes.large.start}) {
    padding-top: 0;
  }
`;

const Form = styled(BaseForm)`
  flex: 1;
  justify-content: center;
  align-items: stretch;
  max-width: 500px;

  @media (min-width: ${theme.screenSizes.large.start}) {
    min-width: 500px;
    width: 500px;
  }
`;

const Logo = styled(AppIcon)`
  align-self: center;
  font-size: 100px;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.title};
  text-align: center;
  font-weight: 600;
  font-size: 36px;

  @media (min-width: ${theme.screenSizes.large.start}) {
    font-size: 48px;
  }
`;

const SuccessIcon = styled.span`
  /* Same as SubmitButton. */
  position: sticky;
  bottom: ${theme.spacing.x8};
  bottom: calc(${theme.spacing.x8} + env(safe-area-inset-bottom, 0));
  margin-bottom: ${theme.spacing.x8};
  align-self: center;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: ${theme.colors.success[500]};
  animation-name: ${theme.animation.fadeIn}, ${theme.animation.scaleIn};
  animation-timing-function: ${theme.animation.ease.enter};
  animation-fill-mode: forwards;
  animation-duration: ${theme.animation.duration.slow};
`;
