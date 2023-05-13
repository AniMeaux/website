import { formatAge } from "@animeaux/shared";
import { Gender } from "@prisma/client";
import { json, LoaderArgs, MetaFunction, SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { SPECIES_ICON } from "~/animals/species";
import { ADOPTABLE_ANIMAL_STATUS } from "~/animals/status";
import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { getConfig, useConfig } from "~/core/config";
import { prisma } from "~/core/db.server";
import { isDefined } from "~/core/isDefined";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { GENDER_TRANSLATION, SPECIES_TRANSLATION } from "~/core/translations";
import { ErrorPage, getErrorTitle } from "~/dataDisplay/errorPage";
import { createCloudinaryUrl, DynamicImage } from "~/dataDisplay/image";
import { Markdown, MarkdownProps } from "~/dataDisplay/markdown";
import { Icon, IconProps } from "~/generated/icon";

const UuidSchema = z.string().uuid();

const UUID_LENGTH = 36;

export async function loader({ params }: LoaderArgs) {
  const result = UuidSchema.safeParse(params["slug"]?.slice(-UUID_LENGTH));
  if (!result.success) {
    throw new Response("Not found", { status: 404 });
  }

  const animal = await prisma.animal.findFirst({
    where: { id: result.data, status: { in: ADOPTABLE_ANIMAL_STATUS } },
    select: {
      id: true,
      avatar: true,
      pictures: true,
      name: true,
      gender: true,
      birthdate: true,
      description: true,
      species: true,
      breed: { select: { name: true } },
      color: { select: { name: true } },
      isOkChildren: true,
      isOkDogs: true,
      isOkCats: true,
      fosterFamily: {
        select: {
          zipCode: true,
          city: true,
        },
      },
    },
  });

  if (animal == null) {
    throw new Response("Not found", { status: 404 });
  }

  return json({ animal });
}

export const meta: MetaFunction<typeof loader> = ({ data, parentsData }) => {
  const animal = data?.animal;
  if (animal == null) {
    return createSocialMeta({ title: getPageTitle(getErrorTitle(404)) });
  }

  const config = getConfig(parentsData);
  return createSocialMeta({
    title: getPageTitle(`Adopter ${animal.name}`),
    imageUrl: createCloudinaryUrl(config.cloudinaryName, animal.avatar, {
      size: "1024",
      aspectRatio: "16:9",
    }),
  });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { animal } = useLoaderData<typeof loader>();

  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header
        className={cn(
          "flex flex-col",
          "md:grid md:grid-cols-[1fr,auto] md:items-center md:gap-6"
        )}
      >
        <h1
          className={cn(
            "text-title-hero-small text-center break-words",
            "md:text-title-hero-large md:text-left"
          )}
        >
          {animal.name}
        </h1>

        <div
          className={cn(
            "hidden",
            "md:flex md:flex-wrap md:items-center md:justify-end md:gap-x-6 md:gap-y-3"
          )}
        >
          <Actions />
        </div>
      </header>

      <div
        className={cn(
          "flex flex-col gap-12",
          "md:flex-row md:items-center md:gap-24"
        )}
      >
        <ImageSection animal={animal} className="md:flex-[1_1_66%]" />
        <InfoSection
          animal={animal}
          className="md:flex-[1_1_34%] md:max-w-xs"
        />
      </div>

      <div
        className={cn(
          "flex flex-col gap-12",
          "md:flex-row-reverse md:items-start md:gap-24"
        )}
      >
        <AggrementsSection
          animal={animal}
          className="md:flex-[1_1_34%] md:max-w-xs"
        />
        <DescriptionSection animal={animal} className="md:flex-[1_1_66%]" />
      </div>

      <div className={cn("flex flex-col items-center gap-3", "md:hidden")}>
        <Actions />
      </div>
    </main>
  );
}

function Actions() {
  const { adoptionFormUrl } = useConfig();

  return (
    <>
      <BaseLink
        to="/conditions-d-adoption"
        className={actionClassNames.standalone({ color: "gray" })}
      >
        Voir les conditions d’adoption
      </BaseLink>

      <BaseLink to={adoptionFormUrl} className={actionClassNames.standalone()}>
        Je l’adopte
      </BaseLink>
    </>
  );
}

function ImageSection({
  animal,
  className,
}: {
  animal: SerializeFrom<typeof loader>["animal"];
  className: string;
}) {
  const allPictures = [animal.avatar].concat(animal.pictures);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);

  return (
    <section className={cn(className, "flex flex-col gap-6")}>
      <div
        ref={scrollContainerRef}
        onScroll={(event) => {
          setVisibleIndex(
            Math.round(
              event.currentTarget.scrollLeft / event.currentTarget.clientWidth
            )
          );
        }}
        className={cn(
          "overflow-auto snap-x snap-mandatory scrollbars-none scroll-smooth min-w-0 rounded-bubble-md flex",
          "sm:rounded-bubble-lg",
          "lg:rounded-bubble-xl"
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
            className="snap-center w-full min-w-0 h-full min-h-0 aspect-4/3 flex-none"
          />
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,64px)] gap-3 justify-center">
        {allPictures.map((pictureId, index) => (
          <button
            key={pictureId}
            onClick={() => {
              invariant(
                scrollContainerRef.current != null,
                "scrollContainerRef should be set"
              );

              scrollContainerRef.current.scrollTo(
                index * scrollContainerRef.current.clientWidth,
                0
              );
            }}
          >
            <DynamicImage
              imageId={pictureId}
              alt={`Photo ${index + 1} de ${animal.name}`}
              sizes={{ default: "64px" }}
              fallbackSize="512"
              loading="eager"
              className={cn(
                "w-16 aspect-4/3 rounded-bubble-sm transition-opacity duration-100 ease-in-out",
                {
                  "opacity-50": visibleIndex !== index,
                  "opacity-100": visibleIndex === index,
                }
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

function InfoSection({
  animal,
  className,
}: {
  animal: SerializeFrom<typeof loader>["animal"];
  className: string;
}) {
  const speciesLabels = [
    SPECIES_TRANSLATION[animal.species],
    animal.breed?.name,
    animal.color?.name,
  ]
    .filter(isDefined)
    .join(" • ");

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

        <Item icon="cakeCandles">
          {DateTime.fromISO(animal.birthdate).toLocaleString(
            DateTime.DATE_FULL
          )}{" "}
          ({formatAge(animal.birthdate)})
        </Item>

        {animal.fosterFamily != null && (
          <Item icon="locationDot">
            En famille d’accueil à {animal.fosterFamily.city} (
            {animal.fosterFamily.zipCode.slice(0, 2)})
          </Item>
        )}
      </ul>
    </section>
  );
}

function Item({
  icon,
  color = "default",
  children,
}: {
  icon: IconProps["id"];
  color?: "pink" | "blue" | "default";
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2">
      <Icon
        id={icon}
        className={cn("flex-none text-[24px]", {
          "text-gray-700": color === "default",
          "text-pink-500": color === "pink",
          "text-brandBlue": color === "blue",
        })}
      />
      <span className="flex-1">{children}</span>
    </li>
  );
}

function AggrementsSection({
  animal,
  className,
}: {
  animal: SerializeFrom<typeof loader>["animal"];
  className: string;
}) {
  return (
    <div className={cn(className, "flex flex-col gap-6")}>
      <h2
        className={cn(
          "text-title-section-small",
          "md:text-title-section-large"
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
  );
}

function Agreement({
  entity,
  value,
}: {
  entity: "babies" | "cats" | "dogs";
  value: boolean | null;
}) {
  let icon: IconProps["id"] =
    entity === "babies"
      ? value == null
        ? "babyCircleQuestion"
        : value
        ? "babyCircleCheck"
        : "babyCircleXMark"
      : entity === "cats"
      ? value == null
        ? "catCircleQuestion"
        : value
        ? "catCircleCheck"
        : "catCircleXMark"
      : value == null
      ? "dogCircleQuestion"
      : value
      ? "dogCircleCheck"
      : "dogCircleXMark";

  return (
    <li
      className={cn(
        "flex-1 rounded-bubble-sm p-3 flex flex-col items-center justify-center gap-2",
        {
          "bg-gray-100 text-gray-700": value == null,
          "bg-brandGreen-lightest text-brandGreen": value === true,
          "bg-brandRed-lightest text-brandRed": value === false,
        }
      )}
    >
      <Icon id={icon} className="text-[32px]" />
      <span className="font-sans text-[14px] font-semibold leading-none">
        {value == null ? "Inconnu" : value ? "Oui" : "Non"}
      </span>
    </li>
  );
}

const DESCRIPTION_COMPONENTS: MarkdownProps["components"] = {
  br: () => <br />,
  p: ({ children }) => <p className="my-6 first:mt-0 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="text-body-emphasis">{children}</strong>
  ),
  em: ({ children }) => <em>{children}</em>,
  code: ({ children }) => (
    <code className="bg-gray-100 rounded-sm px-1 inline-flex text-code-default">
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
    <ul className="my-6 pl-4 list-disc first:mt-0 last:mb-0">{children}</ul>
  ),
  ol: ({ children, start }) => (
    <ol start={start} className="my-6 pl-4 list-decimal first:mt-0 last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
};

function DescriptionSection({
  animal,
  className,
}: {
  animal: SerializeFrom<typeof loader>["animal"];
  className: string;
}) {
  return (
    <section className={cn(className, "flex flex-col gap-6")}>
      <h2
        className={cn(
          "text-title-section-small",
          "md:text-title-section-large"
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
  );
}
