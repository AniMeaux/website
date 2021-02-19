import * as React from "react";
import cn from "classnames";
import { StyleProps } from "../core";

export enum ErrorPageType {
  NOT_FOUND,
}

const ErrorPageTypeImage: { [key in ErrorPageType]: string } = {
  [ErrorPageType.NOT_FOUND]: "🤷‍♂️",
};

type ErrorPageProps = StyleProps & {
  type?: ErrorPageType;
  message: React.ReactNode;
  action?: React.ReactNode;
};

export function ErrorPage({
  type = ErrorPageType.NOT_FOUND,
  message,
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
        {message}
      </h1>

      <div className="mt-8">{action}</div>
    </div>
  );
}
