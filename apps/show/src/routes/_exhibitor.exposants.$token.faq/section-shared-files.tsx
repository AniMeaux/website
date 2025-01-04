import { FileItem } from "#core/data-display/file-item";
import { LazyElement } from "#core/layout/lazy-element";
import { Section } from "#core/layout/section";
import { cn } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionSharedFiles() {
  const { files } = useLoaderData<typeof loader>();

  return (
    <Section.Root width="full" columnCount={1}>
      <LazyElement asChild>
        <Section.TextAside className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow px-safe-page-narrow data-visible:translate-y-0 data-visible:opacity-100">
          <Section.Title className="md:text-center">
            Fichiers partagés
          </Section.Title>

          <p className="md:text-center">
            Retrouvez ici tous les documents essentiels pour préparer et
            organiser votre participation au salon dans les meilleures
            conditions.
          </p>
        </Section.TextAside>
      </LazyElement>

      <section className="flex flex-wrap justify-center gap-1 px-safe-page-narrow md:gap-2 md:px-safe-page-normal">
        {files.map((file, index) => (
          <LazyElement key={file.id} asChild>
            <FileItem.Root asChild>
              <a
                href={file.webViewLink}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "min-w-[150px] max-w-[200px] flex-1 can-hover:focus-visible:focus-spaced",

                  // Transition.
                  "translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100",

                  // Background.
                  "bg-transparent active:bg-mystic-100 can-hover:hover:bg-mystic-50 active:can-hover:hover:bg-mystic-100",
                )}
                style={{ transitionDelay: `${100 * index}ms` }}
              >
                <FileItem.Icon mimeType={file.mimeType} />

                <FileItem.Thumbnail
                  src={file.thumbnailLink}
                  className="transition-transform duration-slow can-hover:group-hover/item:scale-105"
                />

                <FileItem.Filename>{file.name}</FileItem.Filename>
              </a>
            </FileItem.Root>
          </LazyElement>
        ))}
      </section>
    </Section.Root>
  );
}
