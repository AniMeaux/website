import { Markdown, PARAGRAPH_COMPONENTS } from "#i/core/data-display/markdown";
import { LazyElement } from "#i/core/layout/lazy-element";
import type { Faq } from "#i/faq/faq";
import { Icon } from "#i/generated/icon";
import * as Collapsible from "@radix-ui/react-collapsible";
import chunk from "lodash.chunk";
import { Children } from "react";

export function FaqList({ children }: React.PropsWithChildren) {
  const childrenElements = Children.toArray(children);

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
  );
}

export function FaqItem({ faq }: { faq: Faq }) {
  return (
    <LazyElement asChild>
      <li className="grid translate-y-4 grid-cols-1 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
        <Collapsible.Root asChild>
          <div className="group/item grid grid-cols-1 rounded-1 bg-alabaster transition-colors duration-slow data-opened:bg-paleBlue">
            <Collapsible.Trigger className="group/trigger grid grid-cols-fr-auto items-center gap-2 rounded-1 px-2 py-1 text-left text-body-uppercase-emphasis can-hover:focus-visible:focus-spaced">
              {faq.question}

              <Icon
                id="chevron-down-light"
                className="transition-transform duration-slow icon-16 group-data-opened/trigger:-rotate-180 can-hover:group-hover/trigger:group-data-opened/trigger:-translate-y-0.5 can-hover:group-hover/trigger:group-data-closed/trigger:translate-y-0.5"
              />
            </Collapsible.Trigger>

            <Collapsible.Content className="overflow-hidden px-2 py-1 group-data-opened/item:animate-radix-collapsible-content-open group-data-closed/item:animate-radix-collapsible-content-close">
              <Markdown
                content={faq.answer}
                components={PARAGRAPH_COMPONENTS}
              />
            </Collapsible.Content>
          </div>
        </Collapsible.Root>
      </li>
    </LazyElement>
  );
}
