import cn from "classnames";
import { StyleProps } from "core/types";
import { Button, ButtonLink, ButtonProps } from "ui/actions/button";
import { Item, ItemActions, ItemContent, ItemIcon, ItemMainText } from "./item";

export type ErrorType = "notFound" | "serverError" | "unauthorized";

const ErrorTypeImage: Record<ErrorType, string> = {
  notFound: "🤷‍♀️",
  serverError: "🤭",
  unauthorized: "🙅‍♀️",
};

const ErrorTypeMessage: Record<ErrorType, string> = {
  notFound: "Nous n'avons pas trouvé la page que vous chercher",
  serverError: "Une erreur est survenue",
  unauthorized: "Vous n'êtes pas autorisé",
};

export function ErrorActionRefresh() {
  return (
    <Button variant="primary" onClick={() => window.location.reload()}>
      Rafraîchir
    </Button>
  );
}

export function ErrorActionRetry({ children, ...rest }: ButtonProps) {
  return (
    <Button {...rest} variant="primary">
      {children ?? "Rafraîchir"}
    </Button>
  );
}

export function ErrorActionBack() {
  return (
    <ButtonLink href="/" variant="primary">
      Retour
    </ButtonLink>
  );
}

export type ErrorMessageProps = StyleProps & {
  type: ErrorType;
  message?: string;
  action?: React.ReactNode;
};

export function ErrorMessage({
  type,
  message,
  action,
  className,
  ...rest
}: ErrorMessageProps) {
  return (
    <main {...rest} className={cn("ErrorMessage", className)}>
      <div role="img" aria-label="Oups" className="ErrorMessage__image">
        {ErrorTypeImage[type]}
      </div>

      <h1 className="ErrorMessage__message">
        {message ?? ErrorTypeMessage[type]}
      </h1>

      {action != null && <div className="ErrorMessage__action">{action}</div>}
    </main>
  );
}

export function ErrorItem({
  type,
  message,
  action,
  ...rest
}: ErrorMessageProps) {
  return (
    <Item {...rest}>
      <ItemIcon>{ErrorTypeImage[type]}</ItemIcon>

      <ItemContent>
        <ItemMainText>{message ?? ErrorTypeMessage[type]}</ItemMainText>
        {action != null && <ItemActions>{action}</ItemActions>}
      </ItemContent>
    </Item>
  );
}
