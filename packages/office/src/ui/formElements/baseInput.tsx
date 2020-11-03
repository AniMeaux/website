import cn from "classnames";
import * as React from "react";

type InputWrapperProps = React.HTMLAttributes<HTMLSpanElement> & {
  disabled?: boolean;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  errorMessage?: string | null;
  infoMessage?: string | null;
};

export function BaseInput({
  children,
  disabled = false,
  leftAdornment,
  rightAdornment,
  errorMessage,
  infoMessage,
  className,
  ...rest
}: InputWrapperProps) {
  return (
    <span
      {...rest}
      className={cn("relative", { "opacity-75": disabled }, className)}
    >
      {children}

      {leftAdornment != null && (
        <AdornmentContainer side="left">{leftAdornment}</AdornmentContainer>
      )}

      {rightAdornment != null && (
        <AdornmentContainer side="right">{rightAdornment}</AdornmentContainer>
      )}

      {errorMessage != null && <Message error>{errorMessage}</Message>}

      {infoMessage != null && errorMessage == null && (
        <Message>{infoMessage}</Message>
      )}
    </span>
  );
}

type AdornmentContainerProps = React.HTMLAttributes<HTMLSpanElement> & {
  side: "left" | "right";
};

const AdornmentSideClassName: {
  [key in AdornmentContainerProps["side"]]: string;
} = {
  left: "left-0 pl-2",
  right: "right-0 pr-2",
};

function AdornmentContainer({
  side,
  className,
  ...rest
}: AdornmentContainerProps) {
  return (
    <span
      {...rest}
      className={cn(
        "pointer-events-none absolute top-0 h-10 text-gray-700 flex items-center",
        AdornmentSideClassName[side],
        className
      )}
    />
  );
}

type MessageProps = React.HTMLAttributes<HTMLParagraphElement> & {
  error?: boolean;
};

function Message({ error = false, className, ...rest }: MessageProps) {
  return (
    <p
      {...rest}
      className={cn(
        "mt-1 text-sm",
        {
          "text-red-500 font-medium": error,
          "text-opacity-90 text-default-color": !error,
        },
        className
      )}
    />
  );
}

type GetInputClassNameOptions = {
  disabled?: boolean;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  errorMessage?: string | null;
};

export function getInputClassName({
  disabled,
  errorMessage,
  leftAdornment,
  rightAdornment,
}: GetInputClassNameOptions) {
  return cn(
    "a11y-focus h-10 w-full min-w-0 rounded-md bg-black bg-opacity-5 focus:bg-transparent px-4 text-default-color",
    {
      "md:hover:bg-opacity-3": !disabled,
      "pl-12": leftAdornment != null,
      "pr-12": rightAdornment != null,
      "border-2 border-red-500": errorMessage != null,
    }
  );
}
