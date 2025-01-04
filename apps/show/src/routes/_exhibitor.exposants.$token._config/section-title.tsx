import { Section } from "#core/layout/section";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionTitle() {
  const { profile } = useLoaderData<typeof loader>();

  return (
    <Section.Root columnCount={1} isTitleOnly>
      <Section.Title asChild>
        <h1>{profile.name}</h1>
      </Section.Title>
    </Section.Root>
  );
}
