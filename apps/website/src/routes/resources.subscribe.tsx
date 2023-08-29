import { cn } from "#core/classNames.ts";
import { createActionData } from "#core/schemas.ts";
import { Icon } from "#generated/icon.tsx";
import type { ActionArgs } from "@remix-run/node";
import { fetch, json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";

export async function loader() {
  // Nothing to render here.
  return redirect("/");
}

const RESOURCE_PATHNAME = "/resources/subscribe";

const ActionFormData = createActionData(
  z.object({
    email: z.string().email("L’adresse email est invalide"),
  }),
);

type ActionData =
  | { type: "success" }
  | {
      type: "error";
      errors: z.inferFlattenedErrors<typeof ActionFormData.schema>;
    };

export async function action({ request }: ActionArgs) {
  const rawFormData = await request.formData();
  const formData = ActionFormData.schema.safeParse(
    Object.fromEntries(rawFormData.entries()),
  );

  if (!formData.success) {
    return json<ActionData>(
      { type: "error", errors: formData.error.flatten() },
      { status: 400 },
    );
  }

  await subscribeEmail(formData.data);
  return json<ActionData>({ type: "success" });
}

export function SubscriptionForm() {
  const fetcher = useFetcher<typeof action>();
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
        "w-full max-w-sm flex flex-col items-start gap-3",
        "md:max-w-none",
      )}
    >
      <fetcher.Form
        ref={formRef}
        method="POST"
        action={RESOURCE_PATHNAME}
        className={cn(
          "w-full rounded-tl-[16px] rounded-tr-[10px] rounded-br-[16px] rounded-bl-[10px] shadow-base p-1 flex gap-2",
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
          className="min-w-0 flex-1 rounded-bubble-sm bg-transparent px-6 py-2 placeholder-gray-500"
        />

        <button
          className={cn(
            "flex p-3 rounded-bubble-sm text-white transition-[background-color,transform] duration-100 ease-in-out",
            {
              "bg-brandGreen": isSuccess,
              "bg-brandBlue hover:bg-brandBlue-lighter active:scale-95":
                !isSuccess,
            },
          )}
        >
          <Icon id={isSuccess ? "check" : "paperPlane"} />
        </button>
      </fetcher.Form>

      {fetcher.data?.type === "error" && (
        <p className="flex items-center gap-2 text-brandRed">
          <Icon id="circleExclamation" className="text-[14px]" />
          <span className="text-caption-default">
            {fetcher.data.errors.formErrors.join(". ") ||
              fetcher.data.errors.fieldErrors.email}
          </span>
        </p>
      )}
    </div>
  );
}

async function subscribeEmail(body: z.infer<typeof ActionFormData.schema>) {
  if (process.env.SENDINBLUE_API_KEY == null) {
    return;
  }

  try {
    await fetch("https://api.sendinblue.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.SENDINBLUE_API_KEY,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    // TODO: Capture error?
  }
}
