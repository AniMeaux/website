import { Section } from "#i/core/layout/section";
import { FaqItem, FaqList } from "#i/faq/item";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function SectionQuestions() {
  const { questions } = useLoaderData<typeof loader>();

  return (
    <Section.Root columnCount={1}>
      <FaqList>
        {questions.map((question) => (
          <FaqItem key={question.question} faq={question} />
        ))}
      </FaqList>
    </Section.Root>
  );
}
