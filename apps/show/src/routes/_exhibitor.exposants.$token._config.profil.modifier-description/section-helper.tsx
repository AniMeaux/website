import { FormLayout } from "#i/core/layout/form-layout";

export function SectionHelper() {
  return (
    <FormLayout.AsideHelper.Root hideOnSmallScreens>
      <p>
        Ces informations seront utilisées pour votre présentation publique sur
        notre site internet et nos réseaux sociaux.
      </p>

      <p>
        Veuillez vérifier attentivement leur exactitude et la bonne qualité de
        votre logo.
      </p>
    </FormLayout.AsideHelper.Root>
  );
}
