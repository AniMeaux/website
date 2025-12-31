import { Section } from "#i/core/layout/section";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionTitle() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Section.Root columnCount={1} isTitleOnly>
      <Section.Title asChild>
        <h1>{exhibitor.name}</h1>
      </Section.Title>
    </Section.Root>
  );
}
