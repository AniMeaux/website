import { useRouter } from "next/router";
import * as React from "react";

export default function IndexPage() {
  const router = useRouter();

  React.useLayoutEffect(() => {
    router.replace("/users");
  }, [router]);

  return null;
}
