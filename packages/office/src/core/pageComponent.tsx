import { ResourceKey } from "@animeaux/shared-entities";
import { NextComponentType, NextPageContext } from "next";

export type PageComponent<Props = {}> = NextComponentType<
  NextPageContext,
  any,
  Props
> & {
  resourcePermissionKey?: ResourceKey;
  WrapperComponent?: React.ElementType;
};
