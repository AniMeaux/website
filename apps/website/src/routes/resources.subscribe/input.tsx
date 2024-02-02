import { createActionData } from "#core/schemas";
import { Icon } from "#generated/icon";
import type { action } from "#routes/resources.subscribe/route";
import { cn } from "@animeaux/core";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";

const RESOURCE_PATHNAME = "/resources/subscribe";

export const ActionFormData = createActionData(
  z.object({
    email: z.string().email("L’adresse email est invalide"),
  }),
);

export function SubscriptionForm() {
  const fetcher = useFetcher<action>();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => {
      if (fetcher.data?.type === "success") {
        invariant(formRef.current != null, "formRef must be set");
        formRef.current.reset();
      }
    },
    // Use `fetcher.data` instead of `isSuccess` to distinguish 2 successive
    // success.
    [fetcher.data],
  );

  useEffect(
    () => {
      if (fetcher.data?.type === "error") {
        invariant(inputRef.current != null, "inputRef must be set");
        inputRef.current.focus();
      }
    },
    // Use `fetcher.data` instead of `isError` to distinguish 2 successive errors.
    [fetcher.data],
  );

  const isSuccess = fetcher.data?.type === "success";
  const isError = fetcher.data?.type === "error";

  return (
    <div
      className={cn(
        "flex w-full max-w-sm flex-col items-start gap-3",
        "md:max-w-none",
      )}
    >
      <fetcher.Form
        ref={formRef}
        method="POST"
        action={RESOURCE_PATHNAME}
        className={cn(
          "flex w-full gap-2 rounded-bl-[10px] rounded-br-[16px] rounded-tl-[16px] rounded-tr-[10px] p-1 shadow-base",
          {
            "bg-brandRed-lightest": isError,
            "bg-white": !isError,
          },
        )}
      >
        <input
          ref={inputRef}
          type="email"
          name={ActionFormData.keys.email}
          aria-label="Email"
          placeholder="jean@email.com"
          className="min-w-0 flex-1 bg-transparent px-6 py-2 placeholder-gray-500 rounded-bubble-sm"
        />

        <button
          className={cn(
            "flex p-3 text-white transition-[background-color,transform] duration-100 ease-in-out rounded-bubble-sm",
            {
              "bg-brandGreen": isSuccess,
              "bg-brandBlue active:scale-95 hover:bg-brandBlue-lighter":
                !isSuccess,
            },
          )}
        >
          <Icon id={isSuccess ? "check" : "paper-plane"} />
        </button>
      </fetcher.Form>

      {fetcher.data?.type === "error" && (
        <p className="flex items-center gap-2 text-brandRed">
          <Icon id="circle-exclamation" className="text-[14px]" />
          <span className="text-caption-default">
            {fetcher.data.errors.formErrors.join(". ") ||
              fetcher.data.errors.fieldErrors.email}
          </span>
        </p>
      )}
    </div>
  );
}
