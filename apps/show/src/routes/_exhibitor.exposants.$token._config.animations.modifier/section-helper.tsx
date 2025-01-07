import { FormLayout } from "#core/layout/form-layout";
import { PROFILE_EDITION_DEADLINE } from "#exhibitors/profile/dates";
import { DateTime } from "luxon";

export function SectionHelper() {
  return (
    <FormLayout.AsideHelper.Root hideOnSmallScreens>
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
    </FormLayout.AsideHelper.Root>
  );
}
