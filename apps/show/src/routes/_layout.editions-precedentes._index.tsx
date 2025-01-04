import { Routes } from "#core/navigation";
import { SORTED_PREVIOUS_EDITIONS } from "#previous-editions/previous-edition";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

export async function loader() {
  const latestEdition = SORTED_PREVIOUS_EDITIONS[0];
  invariant(latestEdition != null, "There should be an edition");

  throw redirect(Routes.previousEditions.edition(latestEdition).toString());
}

export default function Route() {
  return null;
}
