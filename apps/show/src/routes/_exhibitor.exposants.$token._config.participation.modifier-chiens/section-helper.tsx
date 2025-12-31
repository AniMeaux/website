import { FormLayout } from "#i/core/layout/form-layout";

export function SectionHelper() {
  return (
    <FormLayout.AsideHelper.Root hideOnSmallScreens>
      <p>
        Le montant de votre stand dépend de sa{" "}
        <strong className="text-body-lowercase-emphasis">taille</strong> et de
        votre{" "}
        <strong className="text-body-lowercase-emphasis">
          domaine d’activité
        </strong>
        .
      </p>

      <p>
        Une fois la configuration de votre stand et vos avantages validés par
        notre équipe, vous recevrez par e-mail les informations de paiement.
      </p>

      <p>
        Le règlement pourra être effectué par{" "}
        <strong className="text-body-lowercase-emphasis">
          virement bancaire
        </strong>{" "}
        ou{" "}
        <strong className="text-body-lowercase-emphasis">carte bancaire</strong>
        .
      </p>

      <p>
        Votre inscription sera définitivement confirmée après réception de votre
        paiement.
      </p>
    </FormLayout.AsideHelper.Root>
  );
}
