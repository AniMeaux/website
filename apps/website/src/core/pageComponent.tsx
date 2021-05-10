import { NextPage } from "next";

export type PageComponent<P = {}, IP = P> = NextPage<P, IP> & {
  renderLayout?: (component: React.ReactNode, props: P) => React.ReactNode;
};
