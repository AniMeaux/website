import { ActionArgs, json, redirect } from "@remix-run/node";
import { z } from "zod";

export async function loader() {
  // Nothing to render here.
  return redirect("/");
}

const ActionDataSchema = z.object({
  email: z.string().email({ message: "L’adresse email est invalide" }),
});

export type ActionData =
  | { type: "success" }
  | { type: "error"; errors: z.inferFlattenedErrors<typeof ActionDataSchema> };

export async function action({ request }: ActionArgs) {
  const rawFormData = await request.formData();
  const formData = ActionDataSchema.safeParse(
    Object.fromEntries(rawFormData.entries())
  );

  if (!formData.success) {
    return json<ActionData>(
      { type: "error", errors: formData.error.flatten() },
      { status: 400 }
    );
  }

  // TODO: Register email

  return json<ActionData>({ type: "success" });
}
