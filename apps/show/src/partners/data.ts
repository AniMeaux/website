import type { loader } from "#routes/_layout";
import { useRouteLoaderData } from "@remix-run/react";

export function usePartners() {
  const data = useRouteLoaderData<loader>("routes/_layout");
  return data?.partners ?? [];
}
