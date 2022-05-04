import styled from "styled-components";
import { Button } from "~/core/actions/button";
import { Link } from "~/core/actions/link";
import { StyleProps } from "~/core/types";
import { theme } from "~/styles/theme";

const STATUS_IMAGE: Record<number, string> = {
  400: "🤭",
  401: "🙅‍♀️",
  403: "🙅‍♀️",
  404: "🤷‍♀️",
  500: "🤭",
};

const STATUS_MESSAGE: Record<number, string> = {
  400: "Une erreur est survenue",
  401: "Vous n'êtes pas autorisé",
  403: "Vous n'êtes pas autorisé",
  404: "Nous n'avons pas trouvé la page que vous chercher",
  500: "Une erreur est survenue",
};

const STATUS_ACTION: Record<number, React.ReactNode> = {
  404: (
    <Link variant="primary" isBack href="/">
      Retour vers l'application
    </Link>
  ),
  500: (
    <Button variant="primary" onClick={() => window.location.reload()}>
      Rafraichir
    </Button>
  ),
};

export type ErrorPageProps = StyleProps & {
  status: number;
  message?: string;
  action?: React.ReactNode;
};

export function ErrorPage({
  status,
  message,
  action,
  ...rest
}: ErrorPageProps) {
  const visibleMessage =
    message ?? STATUS_MESSAGE[status] ?? STATUS_MESSAGE[500];

  return (
    <Container {...rest}>
      <Image role="img" aria-label={visibleMessage}>
        {STATUS_IMAGE[status] ?? STATUS_IMAGE[500]}
      </Image>

      <Message>{visibleMessage}</Message>
      <Action>{action ?? STATUS_ACTION[status] ?? STATUS_ACTION[500]}</Action>
    </Container>
  );
}

const Container = styled.main`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const Image = styled.div`
  margin: ${theme.spacing.x8} 0;
  font-size: 128px;
  /* We want it to be square */
  line-height: 1;
  animation-name: ${theme.animation.fadeIn}, ${theme.animation.scaleIn};
  animation-duration: ${theme.animation.duration.slow};
  animation-timing-function: ${theme.animation.ease.enter};
  animation-fill-mode: forwards;
`;

const Message = styled.h1`
  padding: 0 ${theme.spacing.x8};
  font-family: ${theme.typography.fontFamily.title};
  font-size: 20px;
`;

const Action = styled.div`
  margin: ${theme.spacing.x8} auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;
