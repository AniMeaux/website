import { FormLayout } from "#core/layout/form-layout";

export function SectionHelper() {
  return (
    <FormLayout.AsideHelper.Root>
      <p>
        <strong className="text-body-lowercase-emphasis">
          Votre stand sera définitivement confirmé dès réception du règlement de
          cette facture.
        </strong>
        <br />
        En cas de non-paiement à la date d’échéance, l’organisation se réserve
        le droit d’annuler votre participation et de proposer l’emplacement à un
        autre exposant.
      </p>

      <p>
        Votre contribution permet de financer l’organisation du Salon des
        Ani’Meaux, porté par notre association de protection animale et 100 %
        bénévole. Merci pour votre soutien !
      </p>
    </FormLayout.AsideHelper.Root>
  );
}
