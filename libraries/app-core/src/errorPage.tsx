import { getErrorMessage, isNotFoundError } from "@animeaux/shared-entities";
import { StyleProps } from "@animeaux/ui-library";
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

type ErrorPageProps = StyleProps & {
  error: Error;
  type?: ErrorPageType;
  action?: React.ReactNode;
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
  className,
}: ErrorPageProps) {
  return (
    <div className={cn("my-8 flex flex-col items-center", className)}>
      <div
        role="img"
        aria-label="Oups"
        className="animate-fade-in animate-scale-in text-9xl"
      >
        {ErrorPageTypeImage[type]}
      </div>

      <h1 className="mt-16 max-w-full px-8 font-serif text-xl text-center">
        {getErrorMessage(error)}
      </h1>

      <div className="mt-8">{action}</div>
    </div>
  );
}
