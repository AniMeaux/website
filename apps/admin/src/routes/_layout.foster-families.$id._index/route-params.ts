import { zu } from "@animeaux/zod-utils";

export const RouteParamsSchema = zu.object({
  id: zu.string().uuid(),
});
