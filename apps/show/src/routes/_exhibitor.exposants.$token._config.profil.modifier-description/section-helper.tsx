import { FormLayout } from "#core/layout/form-layout";
import { PROFILE_EDITION_DEADLINE } from "#exhibitors/profile/dates";
import { DateTime } from "luxon";

export function SectionHelper() {
  return (
    <FormLayout.AsideHelper.Root hideOnSmallScreens>
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
    </FormLayout.AsideHelper.Root>
  );
}
