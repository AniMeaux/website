import { ErrorCode, getErrorCode } from "@animeaux/shared-entities";
import { firebase } from "core/firebase";
import { Adornment } from "core/formElements/adornment";
import { Field } from "core/formElements/field";
import { Form as BaseForm } from "core/formElements/form";
import { Input } from "core/formElements/input";
import { Label } from "core/formElements/label";
import { PasswordInput } from "core/formElements/passwordInput";
import { SubmitButton } from "core/formElements/submitButton";
import { AppIcon } from "core/icons/appIcon";
import { PageTitle } from "core/pageTitle";
import { useMutation } from "core/request";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { Sentry } from "core/sentry";
import { useState } from "react";
import { FaCheckCircle, FaEnvelope, FaLock } from "react-icons/fa";
import styled, { keyframes } from "styled-components/macro";
import { theme } from "styles/theme";

function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    return [
      ErrorCode.AUTH_INVALID_EMAIL,
      ErrorCode.AUTH_USER_DISABLED,
      ErrorCode.AUTH_USER_NOT_FOUND,
      ErrorCode.AUTH_WRONG_PASSWORD,
    ].includes(getErrorCode(error));
  }

  return false;
}

export function SignInPage() {
  const mutation = useMutation<
    void,
    Error,
    { email: string; password: string }
  >(
    async ({ email, password }) => {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
      } catch (error) {
        if (isAuthError(error)) {
          throw new Error("Identifiants invalides, veuillez réessayer");
        } else {
          Sentry.captureException(error, { extra: { email } });

          throw new Error(
            "un problème est survenu, veuillez réessayer ultérieurement"
          );
        }
      }
    },
    {
      // Relevant errors are reported here.
      disableSentry: true,
    }
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { screenSize } = useScreenSize();

  return (
    <>
      <PageTitle title="Connection" />

      <Main>
        {screenSize >= ScreenSize.MEDIUM && <Image />}

        <Form
          onSubmit={() => mutation.mutate({ email, password })}
          pending={mutation.isLoading}
        >
          <Logo />

          <Title>Bienvenue</Title>

          <Field>
            <Label htmlFor="email" hasError={mutation.isError}>
              Email
            </Label>

            <Input
              name="email"
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              placeholder="ex: jean@mail.fr"
              hasError={mutation.isError}
              leftAdornment={
                <Adornment>
                  <FaEnvelope />
                </Adornment>
              }
            />
          </Field>

          <Field>
            <Label htmlFor="password" hasError={mutation.isError}>
              Mot de passe
            </Label>

            <PasswordInput
              name="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={setPassword}
              hasError={mutation.isError}
              leftAdornment={
                <Adornment>
                  <FaLock />
                </Adornment>
              }
            />
          </Field>

          {mutation.isSuccess ? (
            <SuccessIcon>
              <FaCheckCircle />
            </SuccessIcon>
          ) : (
            <SubmitButton loading={mutation.isLoading}>
              Se connecter
            </SubmitButton>
          )}
        </Form>
      </Main>
    </>
  );
}

const Main = styled.main`
  display: flex;
  align-items: stretch;

  @media (max-width: 799px) {
    flex-direction: column;
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
  width: 50%;
  min-height: 100vh;
  clip-path: ellipse(75% 200% at 25% 50%);
  flex: none;
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

const Form = styled(BaseForm)`
  width: 100%;
  flex: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  max-width: 500px;
  margin: 0 auto;

  @media (min-width: 800px) {
    width: 50%;
  }
`;

const Logo = styled(AppIcon)`
  align-self: center;
  font-size: 100px;
  margin: ${theme.spacing.x10} auto;
`;

const Title = styled.h1`
  margin-bottom: ${theme.spacing.x8};
  padding: 0 ${theme.spacing.x6};
  font-family: ${theme.typography.fontFamily.title};
  text-align: center;
  font-weight: 600;
  font-size: 36px;
  line-height: ${theme.typography.lineHeight.monoLine};

  @media (min-width: 800px) {
    font-size: 48px;
  }
`;

const SuccessIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  margin: ${theme.spacing.x8} 0;
  /* TODO: use button icon. */
  font-size: 40px;
  color: ${theme.colors.success[500]};
  align-self: center;
  animation-name: ${theme.animation.fadeIn}, ${theme.animation.scaleIn};
  animation-timing-function: ${theme.animation.ease.enter};
  animation-fill-mode: forwards;
  animation-duration: ${theme.animation.duration.slow};
`;
