import { Action } from "#core/actions/actions";
import { useConfig } from "#core/config";
import { createConfig } from "#core/config.server";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { DynamicImage } from "#core/data-display/image";
import { ImageUrl } from "#core/data-display/image-url";
import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { BoardCard } from "#core/layout/board-card";
import { HighLightBackground } from "#core/layout/highlight-background";
import { LightBoardCard } from "#core/layout/light-board-card";
import { Section } from "#core/layout/section";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import { NotFoundResponse } from "#core/response.server";
import { ExhibitorSearchParams } from "#exhibitors/search-params";
import {
  EXHIBITOR_ACTIVITY_TAGS,
  EXHIBITOR_TAG_ICON,
  EXHIBITOR_TAG_TRANSLATIONS,
  EXHIBITOR_TARGET_TAGS,
  ExhibitorFilterChip,
  ExhibitorFilterSelector,
  ExhibitorTagChip,
  SORTED_EXHIBITOR_TAGS,
} from "#exhibitors/tag";
import { Icon } from "#generated/icon";
import { Pictogram } from "#generated/pictogram";
import { cn } from "@animeaux/core";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import type { ExhibitorTag, Prisma } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import type {
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import partition from "lodash.partition";
import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

export async function loader({ request }: LoaderFunctionArgs) {
  const {
    featureFlagShowExhibitors,
    featureFlagSiteOnline,
    featureFlagShowProgram,
  } = createConfig();

  if (!featureFlagSiteOnline) {
    throw new NotFoundResponse();
  }

  if (!featureFlagShowExhibitors) {
    return json({ exhibitors: [] });
  }

  const searchParams = ExhibitorSearchParams.parse(
    new URL(request.url).searchParams,
  );

  const where: Prisma.ExhibitorWhereInput[] = [];

  if (searchParams.tags.size > 0) {
    const [targets, activities] = partition(
      Array.from(searchParams.tags),
      (tag) => EXHIBITOR_TARGET_TAGS.includes(tag),
    );

    if (targets.length > 0) {
      where.push({ tags: { hasSome: targets } });
    }

    if (activities.length > 0) {
      where.push({ tags: { hasSome: activities } });
    }
  }

  if (searchParams.hasEvent) {
    where.push({ eventDescription: { not: null } });
  }

  const exhibitors = await prisma.exhibitor.findMany({
    where: { AND: where },
    orderBy: { name: "asc" },
    select: {
      eventDescription: featureFlagShowProgram,
      id: true,
      image: true,
      name: true,
      tags: true,
      url: true,
    },
  });

  return json({ exhibitors });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data?.exhibitors != null ? "Exposants" : getErrorTitle(404),
    ),
  });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { featureFlagShowExhibitors } = useConfig();

  return (
    <>
      <TitleSection />
      {featureFlagShowExhibitors ? <ListSection /> : <WaitingSection />}
    </>
  );
}

function TitleSection() {
  return (
    <Section columnCount={1} isTitleOnly>
      <Section.Title asChild>
        <h1>Exposants</h1>
      </Section.Title>
    </Section>
  );
}

function WaitingSection() {
  const { exhibitorsFormUrl } = useConfig();

  return (
    <Section columnCount={1}>
      <Section.TextAside asChild>
        <BoardCard>
          <h2 className="text-mystic text-title-item">
            Il est encore un peu tôt
          </h2>

          <p>
            Nous sommes actuellement en pleine phase de sélection des exposants
            qui participeront à l’édition prochaine du salon. Nous mettons tout
            en œuvre pour choisir les meilleurs candidats afin de proposer une
            expérience exceptionnelle aux visiteurs.
            <br />
            <br />
            La liste des exposants retenus sera{" "}
            <strong className="text-body-lowercase-emphasis">
              communiquée ultérieurement
            </strong>
            , restez donc à l’affût pour découvrir les acteurs passionnants qui
            feront partie de cet événement inoubliable !
          </p>

          <Section.Action asChild>
            <Action asChild>
              <Link to={exhibitorsFormUrl}>Devenez exposant</Link>
            </Action>
          </Section.Action>
        </BoardCard>
      </Section.TextAside>
    </Section>
  );
}

function ListSection() {
  const { exhibitors } = useLoaderData<typeof loader>();

  const searchParams = ExhibitorSearchParams.parse(
    useOptimisticSearchParams()[0],
  );

  return (
    <Dialog.Root>
      <Section columnCount={1}>
        <SearchParamsForm className="flex flex-wrap items-center gap-1">
          <Dialog.Trigger asChild>
            <Action type="button" color="alabaster" className="flex-none">
              Filtrer
            </Action>
          </Dialog.Trigger>

          {searchParams.hasEvent ? (
            <ExhibitorFilterChip
              name={ExhibitorSearchParams.keys.hasEvent}
              value="on"
              icon="calendar-day-solid"
              label="Animations sur stand"
              className="flex-none"
            />
          ) : null}

          {SORTED_EXHIBITOR_TAGS.filter((tag) =>
            searchParams.tags.has(tag),
          ).map((tag) => (
            <ExhibitorFilterChip
              key={tag}
              name={ExhibitorSearchParams.keys.tags}
              value={tag}
              icon={EXHIBITOR_TAG_ICON[tag].solid}
              label={EXHIBITOR_TAG_TRANSLATIONS[tag]}
              className="flex-none"
            />
          ))}
        </SearchParamsForm>

        <ul className="grid grid-cols-1 items-start gap-4 xs:grid-cols-2 md:grid-cols-3">
          <BecomeExhibitorItem />

          {exhibitors.map((exhibitor, index) => (
            <ExhibitorItem
              key={exhibitor.id}
              exhibitor={exhibitor}
              imageLoading={index < 5 ? "eager" : "lazy"}
              filteredTags={searchParams.tags}
            />
          ))}
        </ul>
      </Section>

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            // Use absolute instead of fixed to avoid performances issues when
            // mobile browser's height change due to scroll.
            "absolute",
            "bottom-0 left-0 right-0 top-0 z-30 overscroll-none bg-white/90 backdrop-blur-xl",
          )}
        />

        <Dialog.Content asChild>
          <FilterModal />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const FilterModal = forwardRef<
  React.ComponentRef<"section">,
  React.ComponentPropsWithoutRef<"section">
>(function FilterModal({ className, ...props }, ref) {
  const { exhibitors } = useLoaderData<typeof loader>();

  const searchParams = ExhibitorSearchParams.parse(
    useOptimisticSearchParams()[0],
  );

  const formRef = useRef<React.ComponentRef<typeof SearchParamsForm>>(null);
  const [isStickyTop, setIsStickyTop] = useState(false);
  const [isStickyBottom, setIsStickyBottom] = useState(false);

  useLayoutEffect(() => {
    invariant(formRef.current != null, "formRef.current must be defined");
    const formElement = formRef.current;

    function checkStickyState() {
      setIsStickyTop(formElement.scrollTop > 0);

      setIsStickyBottom(
        // Use `Math.ceil` because of decimal values.
        Math.ceil(formElement.scrollTop + formElement.clientHeight) <
          formElement.scrollHeight,
      );
    }

    checkStickyState();

    formElement.addEventListener("scroll", checkStickyState);

    return () => {
      formElement.removeEventListener("scroll", checkStickyState);
    };
  }, []);

  return (
    <section
      {...props}
      ref={ref}
      className={cn(
        "fixed bottom-0 left-0 right-0 top-0 z-30 flex w-full flex-col md:bottom-auto md:top-1/2 md:max-h-[90vh] md:-translate-y-1/2",
        className,
      )}
    >
      <HighLightBackground
        color="alabaster"
        className="absolute left-0 top-0 -z-10 h-full w-full"
      />

      <SearchParamsForm
        ref={formRef}
        className="grid min-h-0 grid-cols-1 overflow-y-auto overscroll-contain"
      >
        <header
          className={cn(
            "sticky top-0 z-10 grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-b bg-alabaster pb-2 transition-colors duration-100 pt-safe-2 px-safe-page-narrow md:gap-4 md:pt-4 md:px-safe-page-normal",
            isStickyTop ? "border-mystic/10" : "border-transparent",
          )}
        >
          <Dialog.Title asChild>
            <Section.Title>Filtrer</Section.Title>
          </Dialog.Title>

          <Dialog.Close
            title="Fermer"
            className="flex aspect-square w-[48px] items-center justify-center text-[24px] text-mystic transition-transform duration-100 active:scale-95 focus-visible:focus-spaced-mystic hover:scale-105 hover:active:scale-95"
          >
            <Icon id="x-mark-light" />
          </Dialog.Close>
        </header>

        <SearchParamsFormSection.Root>
          <SearchParamsFormSection.Title>
            Animations
          </SearchParamsFormSection.Title>

          <SearchParamsFormSection.List>
            <ExhibitorFilterSelector
              label="Sur stand"
              name={ExhibitorSearchParams.keys.hasEvent}
              value="on"
              checked={searchParams.hasEvent}
              checkedIcon="calendar-day-solid"
              uncheckedIcon="calendar-day-light"
            />
          </SearchParamsFormSection.List>
        </SearchParamsFormSection.Root>

        <SearchParamsFormSection.Root>
          <SearchParamsFormSection.Title>Cibles</SearchParamsFormSection.Title>

          <SearchParamsFormSection.List>
            {EXHIBITOR_TARGET_TAGS.map((tag) => (
              <ExhibitorFilterSelector
                key={tag}
                label={EXHIBITOR_TAG_TRANSLATIONS[tag]}
                name={ExhibitorSearchParams.keys.tags}
                value={tag}
                checked={searchParams.tags.has(tag)}
                checkedIcon={EXHIBITOR_TAG_ICON[tag].solid}
                uncheckedIcon={EXHIBITOR_TAG_ICON[tag].light}
              />
            ))}
          </SearchParamsFormSection.List>
        </SearchParamsFormSection.Root>

        <SearchParamsFormSection.Root>
          <SearchParamsFormSection.Title>
            Activités
          </SearchParamsFormSection.Title>

          <SearchParamsFormSection.List>
            {EXHIBITOR_ACTIVITY_TAGS.map((tag) => (
              <ExhibitorFilterSelector
                key={tag}
                label={EXHIBITOR_TAG_TRANSLATIONS[tag]}
                name={ExhibitorSearchParams.keys.tags}
                value={tag}
                checked={searchParams.tags.has(tag)}
                checkedIcon={EXHIBITOR_TAG_ICON[tag].solid}
                uncheckedIcon={EXHIBITOR_TAG_ICON[tag].light}
              />
            ))}
          </SearchParamsFormSection.List>
        </SearchParamsFormSection.Root>

        <footer
          className={cn(
            "sticky bottom-0 z-10 flex justify-center border-t bg-alabaster pt-2 transition-colors duration-100 pb-safe-2 px-safe-page-narrow md:justify-end md:pb-4 md:px-safe-page-normal",
            isStickyBottom ? "border-mystic/10" : "border-transparent",
          )}
        >
          <Dialog.Close asChild>
            <Action color="mystic">
              Voir les exposants ({exhibitors.length})
            </Action>
          </Dialog.Close>
        </footer>
      </SearchParamsForm>
    </section>
  );
});

const SearchParamsForm = forwardRef<
  React.ComponentRef<typeof Form>,
  React.ComponentPropsWithoutRef<typeof Form>
>(function SearchParamsForm(props, ref) {
  const submit = useSubmit();

  return (
    <Form
      ref={ref}
      replace
      preventScrollReset
      method="GET"
      onChange={(event) =>
        submit(event.currentTarget, {
          replace: true,
          preventScrollReset: true,
        })
      }
      {...props}
    />
  );
});

const SearchParamsFormSection = {
  Root: function SearchParamsFormSectionRoot({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"section">) {
    return (
      <section
        {...props}
        className={cn(
          "grid grid-cols-1 gap-2 py-2 px-safe-page-narrow md:px-safe-page-normal",
          className,
        )}
      />
    );
  },

  Title: function SearchParamsFormSectionTitle({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"h3">) {
    return (
      <h3 {...props} className={cn("text-mystic text-title-item", className)} />
    );
  },

  List: function SearchParamsFormSectionList({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"div">) {
    return (
      <div
        {...props}
        className={cn(
          "-mx-1 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-0.5 md:gap-1",
          className,
        )}
      />
    );
  },
};

function BecomeExhibitorItem() {
  const { exhibitorsFormUrl } = useConfig();

  return (
    <li className="grid grid-cols-1 gap-2">
      <LightBoardCard
        isSmall
        className="flex aspect-4/3 items-center justify-center"
      >
        <Pictogram
          id="stand-mystic"
          height="42%"
          width={undefined}
          className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2"
        />
      </LightBoardCard>

      <Action asChild className="justify-self-center">
        <Link to={exhibitorsFormUrl}>Devenez exposant</Link>
      </Action>
    </li>
  );
}

function ExhibitorItem({
  exhibitor,
  imageLoading,
  filteredTags,
}: {
  exhibitor: SerializeFrom<typeof loader>["exhibitors"][number];
  imageLoading: NonNullable<
    React.ComponentPropsWithoutRef<typeof DynamicImage>["loading"]
  >;
  filteredTags: Set<ExhibitorTag>;
}) {
  return (
    <li className="grid grid-cols-1 gap-2">
      <Link
        to={exhibitor.url}
        className="group grid grid-cols-1 gap-2 rounded-b-0.5 rounded-t-2 focus-visible:focus-spaced-mystic"
      >
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-2 border border-alabaster">
          <DynamicImage
            image={ImageUrl.parse(exhibitor.image)}
            alt={exhibitor.name}
            loading={imageLoading}
            aspectRatio="4:3"
            objectFit="cover"
            fallbackSize="512"
            sizes={{ default: "100vw", xs: "50vw", md: "30vw", lg: "310px" }}
            className="w-full transition-transform duration-150 ease-in-out group-hover:scale-105"
          />
        </div>

        <div className="grid grid-cols-1 gap-0.5">
          <p className="text-body-uppercase-emphasis">{exhibitor.name}</p>

          <ul className="flex flex-wrap gap-0.5">
            {exhibitor.tags.map((tag) => (
              <ExhibitorTagChip
                key={tag}
                tag={tag}
                isHighlighted={filteredTags.has(tag)}
                className="flex-none"
              />
            ))}
          </ul>
        </div>
      </Link>

      {exhibitor.eventDescription != null ? (
        <div className="grid grid-cols-1 gap-2 rounded-1 bg-alabaster px-2 py-1">
          <p className="grid grid-cols-[auto_1fr] items-start gap-0.5 text-mystic text-body-lowercase-emphasis">
            <span className="flex h-2 items-center">
              <Icon id="calendar-day-solid" />
            </span>

            <span>Animations sur stand</span>
          </p>

          <p>
            <Markdown
              components={SENTENCE_COMPONENTS}
              content={exhibitor.eventDescription}
            />
          </p>
        </div>
      ) : null}
    </li>
  );
}
