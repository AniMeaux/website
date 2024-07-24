import { Routes } from "#core/navigation";
import { SORTED_PREVIOUS_EDITIONS } from "#previous-editions/previous-edition";
import { redirect } from "@remix-run/node";

export async function loader() {
  throw redirect(Routes.previousEditions(SORTED_PREVIOUS_EDITIONS[0]));
}

export default function Route() {
  return null;
}
