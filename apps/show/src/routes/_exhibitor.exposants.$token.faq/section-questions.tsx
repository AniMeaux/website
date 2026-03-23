import { useLoaderData } from "@remix-run/react"

import { Section } from "#i/core/layout/section.js"
import { FaqItem, FaqList } from "#i/faq/item.js"

import type { loader } from "./loader.server.js"

export function SectionQuestions() {
  const { questions } = useLoaderData<typeof loader>()

  return (
    <Section.Root columnCount={1}>
      <FaqList>
        {questions.map((question) => (
          <FaqItem key={question.question} faq={question} />
        ))}
      </FaqList>
    </Section.Root>
  )
}
