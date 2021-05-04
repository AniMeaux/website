import { UserGroup } from "@animeaux/shared-entities";
import { NextComponentType, NextPageContext } from "next";

export type PageComponent<Props = {}> = NextComponentType<
  NextPageContext,
  any,
  Props
> & {
  authorisedGroups?: UserGroup[];
  WrapperComponent?: React.ElementType;
};
