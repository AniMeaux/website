import { User } from "@animeaux/shared";
import { DefaultContext, DefaultState, ParameterizedContext } from "koa";

export type Context = ParameterizedContext<
  DefaultState,
  DefaultContext & {
    currentUser?: User | null;
  },
  any
>;
