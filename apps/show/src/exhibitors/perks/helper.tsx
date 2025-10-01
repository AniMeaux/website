import { HelperCard } from "#core/layout/helper-card";

export function PerksHelper() {
  return (
    <HelperCard.Root color="alabaster">
      <p>
        Le petit-déjeuner exposant est composé de{" "}
        <strong className="text-body-lowercase-emphasis">
          2 viennoiseries, 1 boisson chaude, 1 boisson fraiche
        </strong>{" "}
        et sera servi de{" "}
        <strong className="text-body-lowercase-emphasis">8h30 à 9h15</strong>{" "}
        dans le hall.
      </p>
    </HelperCard.Root>
  );
}
