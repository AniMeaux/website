import { Section } from "#i/core/layout/section.js"

export function SectionTitle() {
  return (
    <Section.Root columnCount={1} isTitleOnly>
      <Section.Title asChild>
        <h1>Programme</h1>
      </Section.Title>
    </Section.Root>
  )
}
