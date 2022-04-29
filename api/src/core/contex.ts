import { CurrentUser } from "@animeaux/shared";
import { DefaultContext, DefaultState, ParameterizedContext } from "koa";

export type Context = ParameterizedContext<
  DefaultState,
  DefaultContext & {
    currentUser?: CurrentUser | null;
  },
  any
>;
