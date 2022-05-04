import styled from "styled-components";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemIcon,
  ItemMainText,
} from "~/core/dataDisplay/item";
import { StyleProps } from "~/core/types";
import { theme } from "~/styles/theme";

type ErrorType = "notFound" | "serverError" | "unauthorized";

const ERROR_TYPE_IMAGE: Record<ErrorType, string> = {
  notFound: "🤷‍♀️",
  serverError: "🤭",
  unauthorized: "🙅‍♀️",
};

const ERROR_TYPE_MESSAGE: Record<ErrorType, string> = {
  notFound: "Nous n'avons pas trouvé la page que vous chercher",
  serverError: "Une erreur est survenue",
  unauthorized: "Vous n'êtes pas autorisé",
};

export type ErrorMessageProps = StyleProps & {
  type: ErrorType;
  message?: string;
  action?: React.ReactNode;
};

export function ErrorMessage({
  type,
  message,
  action,
  ...rest
}: ErrorMessageProps) {
  return (
    <Container {...rest}>
      <Image role="img" aria-label="Oups">
        {ERROR_TYPE_IMAGE[type]}
      </Image>

      <Message>{message ?? ERROR_TYPE_MESSAGE[type]}</Message>
      {action != null && <Action>{action}</Action>}
    </Container>
  );
}

const Container = styled.div`
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

export function ErrorItem({
  type,
  message,
  action,
  ...rest
}: ErrorMessageProps) {
  return (
    <Item {...rest}>
      <ItemIcon>{ERROR_TYPE_IMAGE[type]}</ItemIcon>

      <ItemContent>
        <ItemMainText>{message ?? ERROR_TYPE_MESSAGE[type]}</ItemMainText>
        {action != null && <ItemActions>{action}</ItemActions>}
      </ItemContent>
    </Item>
  );
}
