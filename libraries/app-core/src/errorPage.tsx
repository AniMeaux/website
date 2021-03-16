import { getErrorMessage, isNotFoundError } from "@animeaux/shared-entities";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemIcon,
  ItemMainText,
  StyleProps,
} from "@animeaux/ui-library";
import cn from "classnames";
import * as React from "react";

export enum ErrorPageType {
  NOT_FOUND,
  SERVER_ERROR,
  UNAUTHORIZED,
}

const ErrorPageTypeImage: { [key in ErrorPageType]: string } = {
  [ErrorPageType.NOT_FOUND]: "🤷‍♀️",
  [ErrorPageType.SERVER_ERROR]: "🤭",
  [ErrorPageType.UNAUTHORIZED]: "🙅‍♀️",
};

export type ErrorPageProps = StyleProps & {
  error: Error;
  type?: ErrorPageType;
  action?: React.ReactNode;
  asItem?: boolean;
};

function getErrorType(error: Error): ErrorPageType {
  return isNotFoundError(error)
    ? ErrorPageType.NOT_FOUND
    : ErrorPageType.SERVER_ERROR;
}

export function ErrorPage({
  error,
  type = getErrorType(error),
  action,
  asItem = false,
  className,
  ...rest
}: ErrorPageProps) {
  const icon = ErrorPageTypeImage[type];
  const errorMessage = getErrorMessage(error);

  if (asItem) {
    return (
      <Item>
        <ItemIcon>{icon}</ItemIcon>

        <ItemContent>
          <ItemMainText>{errorMessage}</ItemMainText>
          {action != null && <ItemActions>{action}</ItemActions>}
        </ItemContent>
      </Item>
    );
  }

  return (
    <div {...rest} className={cn("my-8 flex flex-col items-center", className)}>
      <div
        role="img"
        aria-label="Oups"
        className="animate-fade-in animate-scale-in text-9xl"
      >
        {icon}
      </div>

      <h1 className="mt-16 max-w-full px-8 font-serif text-xl text-center">
        {errorMessage}
      </h1>

      <div className="mt-8">{action}</div>
    </div>
  );
}
