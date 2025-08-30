import { zu } from "@animeaux/zod-utils";

export const routeParamsSchema = zu.object({
  id: zu.string().uuid(),
  invoiceId: zu.string().uuid(),
});
