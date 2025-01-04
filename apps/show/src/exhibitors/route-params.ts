import { zu } from "@animeaux/zod-utils";

export const RouteParamsSchema = zu.object({
  token: zu.string().uuid(),
});
