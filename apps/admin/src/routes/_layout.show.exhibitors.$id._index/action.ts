import { zu } from "@animeaux/zod-utils";

export const ActionIntent = {
  deleteExhibitor: "delete-exhibitor",
  deleteInvoice: "delete-invoice",
} as const;

export type ActionIntent = (typeof ActionIntent)[keyof typeof ActionIntent];

export const actionSchema = zu.discriminatedUnion("intent", [
  zu.object({
    intent: zu.literal(ActionIntent.deleteExhibitor),
  }),

  zu.object({
    intent: zu.literal(ActionIntent.deleteInvoice),
    invoiceId: zu.string().uuid(),
  }),
]);
