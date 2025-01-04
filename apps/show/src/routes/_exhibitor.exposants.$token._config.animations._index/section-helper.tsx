import { FormLayout } from "#core/layout/form-layout";
import { Routes } from "#core/navigation";
import {
  PROFILE_EDITION_DEADLINE,
  canEditProfile,
} from "#exhibitors/profile/dates";
import { Link, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./route";

export function SectionHelper() {
  const { token } = useLoaderData<typeof loader>();

  return (
    <FormLayout.AsideHelper.Root>
      <p>
        Les animations sont au cœur de la dynamique du salon ! Elles seront
        répertoriées dans un programme officiel et mises en avant sur nos
        réseaux sociaux, notre site internet, ainsi que dans le programme papier
        distribué sur place.
      </p>

      <p>
        <strong className="text-body-lowercase-emphasis">
          Aucune modification ne sera possible après le{" "}
          {PROFILE_EDITION_DEADLINE.toLocaleString(DateTime.DATE_FULL)}.
        </strong>
      </p>

      {canEditProfile() ? (
        <FormLayout.AsideHelper.Action asChild>
          <Link to={Routes.exhibitors.token(token).animations.edit.toString()}>
            Modifier
          </Link>
        </FormLayout.AsideHelper.Action>
      ) : null}
    </FormLayout.AsideHelper.Root>
  );
}
