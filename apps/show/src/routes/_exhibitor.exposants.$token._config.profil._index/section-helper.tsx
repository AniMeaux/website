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
        Ces informations seront utilisées pour votre présentation publique sur
        notre site internet et nos réseaux sociaux.
      </p>

      <p>
        Veuillez vérifier attentivement leur exactitude et la bonne qualité de
        votre logo, car{" "}
        <strong className="text-body-lowercase-emphasis">
          aucune modification ne sera possible après le{" "}
          {PROFILE_EDITION_DEADLINE.toLocaleString(DateTime.DATE_FULL)}
        </strong>
        .
      </p>

      {canEditProfile() ? (
        <FormLayout.AsideHelper.Action asChild>
          <Link to={Routes.exhibitors.token(token).profile.edit.toString()}>
            Modifier
          </Link>
        </FormLayout.AsideHelper.Action>
      ) : null}
    </FormLayout.AsideHelper.Root>
  );
}
