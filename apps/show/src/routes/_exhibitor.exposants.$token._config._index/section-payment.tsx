import { Action } from "#core/actions/action.js";
import { HelperCard } from "#core/layout/helper-card";
import { Routes } from "#core/navigation.js";
import { InvoiceStatus } from "#invoice/status.js";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function SectionPayment() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (exhibitor.invoices.length === 0) {
    return null;
  }

  if (
    exhibitor.invoices.every(
      (invoice) => invoice.status === InvoiceStatus.Enum.PAID,
    )
  ) {
    return (
      <HelperCard.Root color="paleBlue">
        <HelperCard.Title>Paiement validé</HelperCard.Title>

        <p>
          Votre règlement a été reçu et validé. Votre inscription ou prestation
          est désormais confirmée. Merci pour votre soutien à notre
          association !
        </p>
      </HelperCard.Root>
    );
  }

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>En attente de paiement</HelperCard.Title>

      <p>
        Nous sommes en attente d’un règlement de votre part. Votre inscription
        ou prestation sera confirmée dès réception du paiement.
      </p>

      <p>
        Règlement possible par carte bancaire ou virement bancaire. Plus vite
        vous réglez, plus vite vous soutenez notre association !
      </p>

      <Action color="prussianBlue" className="justify-self-center" asChild>
        <Link to={Routes.exhibitors.token(exhibitor.token).invoice.toString()}>
          Payer maintenant
        </Link>
      </Action>
    </HelperCard.Root>
  );
}
