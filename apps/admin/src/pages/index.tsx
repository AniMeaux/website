import { PageComponent } from "@animeaux/app-core";
import { useRouter } from "@animeaux/ui-library";
import * as React from "react";

const IndexPage: PageComponent = () => {
  const router = useRouter();

  React.useLayoutEffect(() => {
    router.replace("/users");
  }, [router]);

  return null;
};

export default IndexPage;
