import { HelperCard } from "#core/layout/helper-card";

export function DogsHelper() {
  return (
    <HelperCard.Root color="paleBlue">
      <p>
        Votre chien est le bienvenu sous réserve de respecter le{" "}
        <strong className="text-body-lowercase-emphasis">
          règlement sanitaire
        </strong>{" "}
        et de{" "}
        <strong className="text-body-lowercase-emphasis">
          bien-être animal
        </strong>{" "}
        en vigueur.
        <br />
        Il est indispensable de compléter les informations ci-dessous le
        concernant.
      </p>

      <p>
        <strong className="text-body-lowercase-emphasis">Attention</strong>
        {" "}: remplir ce formulaire ne vous dispense pas du contrôle
        vétérinaire obligatoire à l’entrée, mais permet de gagner du temps lors
        de votre arrivée. En choisissant de venir avec votre chien, vous vous
        engagez à être présent au salon au plus tard à{" "}
        <strong className="text-body-lowercase-emphasis">
          8h30 le samedi 7 juin
        </strong>{" "}
        2025.
      </p>
    </HelperCard.Root>
  );
}
