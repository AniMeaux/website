import { cn } from "@animeaux/core"
import * as Collapsible from "@radix-ui/react-collapsible"
import { chunk } from "es-toolkit/array"
import { Children } from "react"

import {
  Markdown,
  PARAGRAPH_COMPONENTS,
} from "#i/core/data-display/markdown.js"
import { LazyElement } from "#i/core/layout/lazy-element.js"
import type { Faq } from "#i/faq/faq.js"
import { Icon } from "#i/generated/icon.js"

export function FaqList({ children }: React.PropsWithChildren) {
  const childrenElements = Children.toArray(children)

  return (
    <>
      <ul className="grid grid-cols-1 gap-2 sm:hidden">{childrenElements}</ul>

      <ul className="hidden grid-cols-2 gap-x-4 sm:grid md:hidden">
        {chunk(childrenElements, Math.ceil(childrenElements.length / 2)).map(
          (column, index) => (
            <li key={index} className="grid grid-cols-1">
              <ul className="grid grid-cols-1 content-start gap-2">{column}</ul>
            </li>
          ),
        )}
      </ul>

      <ul className="hidden grid-cols-3 gap-x-4 md:grid">
        {chunk(childrenElements, Math.ceil(childrenElements.length / 3)).map(
          (column, index) => (
            <li key={index} className="grid grid-cols-1">
              <ul className="grid grid-cols-1 content-start gap-2">{column}</ul>
            </li>
          ),
        )}
      </ul>
    </>
  )
}

export function FaqItem({ faq }: { faq: Faq }) {
  return (
    <LazyElement asChild>
      <li
        className={cn(
          "grid grid-cols-1",
          "animation-duration-very-slow out-opacity-0 out-translate-y-4 data-visible:animate-enter data-hidden:opacity-0",
        )}
      >
        <Collapsible.Root asChild>
          <div className="group/item grid grid-cols-1 rounded-1 bg-alabaster transition-colors duration-slow data-opened:bg-pale-blue">
            <Collapsible.Trigger className="group/trigger grid grid-cols-fr-auto items-center gap-2 rounded-1 px-2 py-1 text-left text-body-uppercase-emphasis focus-ring-spaced focus-visible:focus-ring">
              {faq.question}

              <Icon
                id="chevron-down-light"
                className="icon-16 transition-transform duration-slow group-data-opened/trigger:-rotate-180 group-hover/trigger:group-data-opened/trigger:-translate-y-0.5 group-hover/trigger:group-data-closed/trigger:translate-y-0.5"
              />
            </Collapsible.Trigger>

            <Collapsible.Content className="overflow-hidden px-2 py-1 animation-duration-slow animation-ease-in-out in-height-(--radix-collapsible-content-height) in-overflow-hidden out-height-0 data-opened:animate-enter data-closed:animate-exit">
              <Markdown
                content={faq.answer}
                components={PARAGRAPH_COMPONENTS}
              />
            </Collapsible.Content>
          </div>
        </Collapsible.Root>
      </li>
    </LazyElement>
  )
}
