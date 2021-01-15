import { NextComponentType, NextPageContext } from "next";

export type PageComponent<Props = {}> = NextComponentType<
  NextPageContext,
  any,
  Props
>;
