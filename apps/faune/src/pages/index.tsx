import { PageComponent } from "@animeaux/app-core";
import { useRouter } from "next/router";
import * as React from "react";

const IndexPage: PageComponent = () => {
  const router = useRouter();

  React.useLayoutEffect(() => {
    router.replace("/host-families");
  }, [router]);

  return null;
};

export default IndexPage;
