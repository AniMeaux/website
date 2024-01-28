import { ActionFormData } from "#routes/resources.subscribe/input";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { z } from "zod";

export async function loader() {
  // Nothing to render here.
  return redirect("/");
}

type ActionData =
  | { type: "success" }
  | {
      type: "error";
      errors: z.inferFlattenedErrors<typeof ActionFormData.schema>;
    };

export type action = typeof action;

export async function action({ request }: ActionFunctionArgs) {
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

  if (process.env.SENDINBLUE_API_KEY != null) {
    try {
      await fetch("https://api.sendinblue.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": process.env.SENDINBLUE_API_KEY,
        },
        body: JSON.stringify(formData.data),
      });
    } catch (error) {
      // TODO: Capture error?
    }
  }

  return json<ActionData>({ type: "success" });
}
