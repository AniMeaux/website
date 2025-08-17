import { zu } from "@animeaux/zod-utils";

export const actionSchema = zu.object({
  invoiceId: zu.string().uuid(),
});
