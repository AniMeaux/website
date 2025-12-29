import { ShowInvoiceStatus } from "@animeaux/prisma";

export namespace InvoiceStatus {
  export const Enum = ShowInvoiceStatus;
  export type Enum = ShowInvoiceStatus;

  export const translation: Record<Enum, string> = {
    [Enum.PAID]: "Payée",
    [Enum.TO_PAY]: "À payer",
  };

  export const values = [Enum.TO_PAY, Enum.PAID];
}
