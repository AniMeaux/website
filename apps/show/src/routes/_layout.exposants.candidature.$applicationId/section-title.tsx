import { Section } from "#i/core/layout/section";

export function SectionTitle() {
  return (
    <Section.Root columnCount={1} isTitleOnly>
      <Section.Title asChild>
        <h1>Candidature exposant</h1>
      </Section.Title>
    </Section.Root>
  );
}
