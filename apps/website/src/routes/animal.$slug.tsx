import { cn, formatAge } from "@animeaux/core"
import { Gender, ScreeningResult, Species } from "@animeaux/prisma"
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { DateTime } from "luxon"
import { useRef, useState } from "react"
import invariant from "tiny-invariant"
import { z } from "zod"

import {
  SCREENING_RESULT_ICON,
  SCREENING_RESULT_TRANSLATION,
} from "#i/animals/screening.js"
import { SPECIES_ICON } from "#i/animals/species.js"
import { ADOPTABLE_ANIMAL_STATUS } from "#i/animals/status.js"
import { actionClassNames } from "#i/core/actions.js"
import { BaseLink } from "#i/core/base-link.js"
import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js"
import {
  createCloudinaryUrl,
  DynamicImage,
} from "#i/core/data-display/image.js"
import type { MarkdownProps } from "#i/core/data-display/markdown.js"
import { Markdown } from "#i/core/data-display/markdown.js"
import { prisma } from "#i/core/db.server.js"
import { isDefined } from "#i/core/is-defined.js"
import { createSocialMeta } from "#i/core/meta.js"
import { getPageTitle } from "#i/core/page-title.js"
import {
  GENDER_TRANSLATION,
  SPECIES_TRANSLATION_STANDALONE,
} from "#i/core/translations.js"
import type { IconProps } from "#i/generated/icon.js"
import { Icon } from "#i/generated/icon.js"

const UuidSchema = z.string().uuid()

const UUID_LENGTH = 36

export async function loader({ params }: LoaderFunctionArgs) {
  const result = UuidSchema.safeParse(params["slug"]?.slice(-UUID_LENGTH))
  if (!result.success) {
    throw new Response("Not found", { status: 404 })
  }

  const animal = await prisma.animal.findFirst({
    where: { id: result.data, status: { in: ADOPTABLE_ANIMAL_STATUS } },
    select: {
      avatar: true,
      birthdate: true,
      breed: { select: { name: true } },
      color: { select: { name: true } },
      description: true,
      fosterFamily: {
        select: {
          city: true,
          zipCode: true,
        },
      },
      gender: true,
      id: true,
      isOkCats: true,
      isOkChildren: true,
      isOkDogs: true,
      name: true,
      pictures: true,
      screeningFelv: true,
      screeningFiv: true,
      species: true,
    },
  })

  if (animal == null) {
    throw new Response("Not found", { status: 404 })
  }

  return json({ animal })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const animal = data?.animal
  if (animal == null) {
    return createSocialMeta({ title: getPageTitle(getErrorTitle(404)) })
  }

  return createSocialMeta({
    title: getPageTitle(`Adopter ${animal.name}`),
    imageUrl: createCloudinaryUrl(
      CLIENT_ENV.CLOUDINARY_CLOUD_NAME,
      animal.avatar,
      {
        size: "1024",
        aspectRatio: "16:9",
      },
    ),
  })
}

export function ErrorBoundary() {
  return <ErrorPage />
}

export default function Route() {
  const { animal } = useLoaderData<typeof loader>()

  return (
    <main className="flex w-full flex-col gap-12 px-page">
      <header
        className={cn(
          "flex flex-col",
          "md:grid md:grid-cols-fr-auto md:items-center md:gap-6",
        )}
      >
        <h1
          className={cn(
            "text-center text-hero-title-small wrap-break-word",
            "md:text-left md:text-hero-title-large",
          )}
        >
          {animal.name}
        </h1>

        <div
          className={cn(
            "hidden",
            "md:flex md:flex-wrap md:items-center md:justify-end md:gap-x-6 md:gap-y-3",
          )}
        >
          <Actions />
        </div>
      </header>

      <div
        className={cn(
          "flex flex-col gap-12",
          "md:flex-row md:items-center md:gap-24",
        )}
      >
        <ImageSection className="md:flex-[1_1_66%]" />
        <InfoSection className="md:max-w-xs md:flex-[1_1_34%]" />
      </div>

      <div
        className={cn(
          "flex flex-col gap-12",
          "md:flex-row-reverse md:items-start md:gap-24",
        )}
      >
        <AggrementsSection className="md:max-w-xs md:flex-[1_1_34%]" />
        <DescriptionSection className="md:flex-[1_1_66%]" />
      </div>

      <div className={cn("flex flex-col items-center gap-3", "md:hidden")}>
        <Actions />
      </div>
    </main>
  )
}

function Actions() {
  return (
    <>
      <BaseLink
        to="/conditions-d-adoption"
        className={actionClassNames.standalone({ color: "gray" })}
      >
        Voir les conditions d’adoption
      </BaseLink>

      <BaseLink
        to={CLIENT_ENV.ADOPTION_FORM_URL}
        className={actionClassNames.standalone()}
      >
        Je l’adopte
      </BaseLink>
    </>
  )
}

function ImageSection({ className }: { className: string }) {
  const { animal } = useLoaderData<typeof loader>()
  const allPictures = [animal.avatar].concat(animal.pictures)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [visibleIndex, setVisibleIndex] = useState(0)

  return (
    <section className={cn(className, "flex flex-col gap-6")}>
      <div
        ref={scrollContainerRef}
        onScroll={(event) => {
          setVisibleIndex(
            Math.round(
              event.currentTarget.scrollLeft / event.currentTarget.clientWidth,
            ),
          )
        }}
        className={cn(
          "scrollbars-none flex min-w-0 snap-x snap-mandatory overflow-auto scroll-smooth rounded-bubble-md",
          "sm:rounded-bubble-lg",
          "lg:rounded-bubble-xl",
        )}
      >
        {allPictures.map((pictureId, index) => (
          <DynamicImage
            key={pictureId}
            imageId={pictureId}
            alt={`Photo ${index + 1} de ${animal.name}`}
            sizes={{ lg: "512px", md: "50vw", default: "100vw" }}
            fallbackSize="2048"
            loading="eager"
            className="aspect-4/3 size-full min-h-0 min-w-0 flex-none snap-center"
          />
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,64px)] justify-center gap-3">
        {allPictures.map((pictureId, index) => (
          <button
            key={pictureId}
            onClick={() => {
              invariant(
                scrollContainerRef.current != null,
                "scrollContainerRef should be set",
              )

              scrollContainerRef.current.scrollTo(
                index * scrollContainerRef.current.clientWidth,
                0,
              )
            }}
          >
            <DynamicImage
              imageId={pictureId}
              alt={`Photo ${index + 1} de ${animal.name}`}
              sizes={{ default: "64px" }}
              fallbackSize="512"
              loading="eager"
              className={cn(
                "aspect-4/3 w-16 rounded-bubble-sm transition-opacity",
                {
                  "opacity-50": visibleIndex !== index,
                  "opacity-100": visibleIndex === index,
                },
              )}
            />
          </button>
        ))}
      </div>
    </section>
  )
}

function InfoSection({ className }: { className: string }) {
  const { animal } = useLoaderData<typeof loader>()

  const speciesLabels = [
    SPECIES_TRANSLATION_STANDALONE[animal.species],
    animal.breed?.name,
    animal.color?.name,
  ]
    .filter(isDefined)
    .join(" • ")

  return (
    <section className={cn(className, "flex flex-col")}>
      <ul className="flex flex-col gap-3">
        <Item
          icon={animal.gender === Gender.FEMALE ? "venus" : "mars"}
          color={animal.gender === Gender.FEMALE ? "pink" : "blue"}
        >
          {GENDER_TRANSLATION[animal.gender]}
        </Item>

        <Item icon={SPECIES_ICON[animal.species]}>{speciesLabels}</Item>

        <Item icon="cake-candles">
          {DateTime.fromISO(animal.birthdate).toLocaleString(
            DateTime.DATE_FULL,
          )}{" "}
          ({formatAge(animal.birthdate)})
        </Item>

        {animal.fosterFamily != null && (
          <Item icon="location-dot">
            En famille d’accueil à {animal.fosterFamily.city} (
            {animal.fosterFamily.zipCode.slice(0, 2)})
          </Item>
        )}

        {animal.species === Species.CAT &&
        animal.screeningFiv !== ScreeningResult.UNKNOWN ? (
          <Item
            icon={SCREENING_RESULT_ICON[animal.screeningFiv]}
            color={
              animal.screeningFiv === ScreeningResult.NEGATIVE ? "green" : "red"
            }
          >
            Est{" "}
            {SCREENING_RESULT_TRANSLATION[animal.screeningFiv][animal.gender]}{" "}
            au FIV
          </Item>
        ) : null}

        {animal.species === Species.CAT &&
        animal.screeningFelv !== ScreeningResult.UNKNOWN ? (
          <Item
            icon={SCREENING_RESULT_ICON[animal.screeningFelv]}
            color={
              animal.screeningFelv === ScreeningResult.NEGATIVE
                ? "green"
                : "red"
            }
          >
            Est{" "}
            {SCREENING_RESULT_TRANSLATION[animal.screeningFelv][animal.gender]}{" "}
            au FeLV
          </Item>
        ) : null}
      </ul>
    </section>
  )
}

function Item({
  icon,
  color = "default",
  children,
}: {
  icon: IconProps["id"]
  color?: "pink" | "blue" | "default" | "red" | "green"
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-2">
      <Icon
        id={icon}
        className={cn("flex-none icon-24", {
          "text-gray-700": color === "default",
          "text-pink-500": color === "pink",
          "text-brand-blue": color === "blue",
          "text-brand-red": color === "red",
          "text-brand-green": color === "green",
        })}
      />
      <span className="flex-1">{children}</span>
    </li>
  )
}

function AggrementsSection({ className }: { className: string }) {
  const { animal } = useLoaderData<typeof loader>()

  return (
    <div className={cn(className, "flex flex-col gap-6")}>
      <h2
        className={cn(
          "text-section-title-small",
          "md:text-section-title-large",
        )}
      >
        Ses ententes
      </h2>

      <ul className={cn("flex gap-3", "xs:gap-6", "md:gap-3")}>
        <Agreement entity="babies" value={animal.isOkChildren} />
        <Agreement entity="cats" value={animal.isOkCats} />
        <Agreement entity="dogs" value={animal.isOkDogs} />
      </ul>
    </div>
  )
}

function Agreement({
  entity,
  value,
}: {
  entity: "babies" | "cats" | "dogs"
  value: boolean | null
}) {
  const icon: IconProps["id"] =
    entity === "babies"
      ? value == null
        ? "baby-circle-question"
        : value
          ? "baby-circle-check"
          : "baby-circle-x-mark"
      : entity === "cats"
        ? value == null
          ? "cat-circle-question"
          : value
            ? "cat-circle-check"
            : "cat-circle-x-mark"
        : value == null
          ? "dog-circle-question"
          : value
            ? "dog-circle-check"
            : "dog-circle-x-mark"

  return (
    <li
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-2 rounded-bubble-sm p-3",
        {
          "bg-gray-100 text-gray-700": value == null,
          "bg-brand-green-lightest text-brand-green": value === true,
          "bg-brand-red-lightest text-brand-red": value === false,
        },
      )}
    >
      <Icon id={icon} className="icon-32" />
      <span className="font-sans icon-14 leading-none font-semibold">
        {value == null ? "Inconnu" : value ? "Oui" : "Non"}
      </span>
    </li>
  )
}

const DESCRIPTION_COMPONENTS: MarkdownProps["components"] = {
  br: () => <br />,
  p: ({ children }) => <p className="my-6 first:mt-0 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="text-body-emphasis">{children}</strong>
  ),
  em: ({ children }) => <em>{children}</em>,
  code: ({ children }) => (
    <code className="inline-flex rounded-xs bg-gray-100 px-1 text-code">
      {children}
    </code>
  ),
  a: ({ children, href, title }) => (
    <BaseLink
      to={href}
      title={title}
      className={actionClassNames.proseInline()}
    >
      {children}
    </BaseLink>
  ),
  ul: ({ children }) => (
    <ul className="my-6 list-disc pl-4 first:mt-0 last:mb-0">{children}</ul>
  ),
  ol: ({ children, start }) => (
    <ol start={start} className="my-6 list-decimal pl-4 first:mt-0 last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
}

function DescriptionSection({ className }: { className: string }) {
  const { animal } = useLoaderData<typeof loader>()

  return (
    <section className={cn(className, "flex flex-col gap-6")}>
      <h2
        className={cn(
          "text-section-title-small",
          "md:text-section-title-large",
        )}
      >
        Son histoire
      </h2>

      <article>
        {animal.description == null ? (
          <p>À venir…</p>
        ) : (
          <Markdown components={DESCRIPTION_COMPONENTS}>
            {animal.description}
          </Markdown>
        )}
      </article>
    </section>
  )
}
