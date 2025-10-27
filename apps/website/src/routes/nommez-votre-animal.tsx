import { animalNames } from "#animals/data";
import { ACTIVE_ANIMAL_STATUS } from "#animals/status";
import { actionClassNames } from "#core/actions";
import { prisma } from "#core/db.server";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { Gender } from "@animeaux/prisma/client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import orderBy from "lodash.orderby";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";

// Multiple of 2 and 3 to be nicely displayed.
const ANIMAL_NAME_COUNT_PER_PAGE = 18;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const params = getParams(url.searchParams);

  const animals = await prisma.animal.findMany({
    where: {
      name: { in: animalNames.map((name) => name.label), mode: "insensitive" },
      status: { in: ACTIVE_ANIMAL_STATUS },
    },
    select: { name: true },
  });

  const usedNames = animals.map((animal) => animal.name.toLowerCase());

  // Remove names used by active animals.
  let names = animalNames.filter(
    (name) => !usedNames.includes(name.label.toLowerCase()),
  );

  if (params.l != null) {
    const firstLetter = params.l.toLowerCase();
    names = names.filter((name) =>
      name.label.toLowerCase().startsWith(firstLetter),
    );
  }

  if (params.g != null) {
    const gender = params.g;
    names = names.filter(
      (name) => name.gender == null || name.gender === gender,
    );
  }

  names = orderBy(
    pickRandom(names, ANIMAL_NAME_COUNT_PER_PAGE),
    (name) => name.label,
  );

  return json({ names });
}

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Nommez votre animal") });
};

export default function Route() {
  const { names } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const params = getParams(searchParams);

  return (
    <main className={cn("flex w-full flex-col gap-12 px-page", "md:gap-24")}>
      <header className="flex flex-col gap-6">
        <h1
          className={cn(
            "text-center text-title-hero-small",
            "md:text-left md:text-title-hero-large",
          )}
        >
          Nommez votre animal
        </h1>

        <p className={cn("text-center", "md:text-left")}>
          Vous ne savez pas comment nommer votre animal ? Voici notre outil pour
          vous aider !
        </p>
      </header>

      <div
        className={cn(
          "flex flex-col gap-12",
          "md:flex-row md:items-start md:gap-24",
        )}
      >
        <section
          className={cn(
            "flex bg-white p-6 shadow-base rounded-bubble-lg",
            "md:max-w-xs md:flex-1",
          )}
        >
          <Form
            method="GET"
            replace
            preventScrollReset
            className="flex w-full flex-col gap-6"
          >
            <h2 className="text-title-item">Critères</h2>

            <div className="flex flex-col gap-3">
              <div className={formClassNames.field()}>
                <label
                  htmlFor="first-letter"
                  className={formClassNames.label()}
                >
                  Première lettre
                </label>

                <FirstLetterInput defaultValue={params.l ?? ""} />
              </div>

              <div className={formClassNames.field()}>
                <span className={formClassNames.label()}>Genre</span>

                <label className={formClassNames.checkboxLabel()}>
                  <input
                    type="radio"
                    name="g"
                    value=""
                    defaultChecked={!params.g}
                    className={formClassNames.checkbox()}
                  />
                  Indiférent
                </label>

                <label className={formClassNames.checkboxLabel()}>
                  <input
                    type="radio"
                    name="g"
                    value={Gender.FEMALE}
                    defaultChecked={params.g === Gender.FEMALE}
                    className={formClassNames.checkbox()}
                  />
                  Femelle
                </label>

                <label className={formClassNames.checkboxLabel()}>
                  <input
                    type="radio"
                    name="g"
                    value={Gender.MALE}
                    defaultChecked={params.g === Gender.MALE}
                    className={formClassNames.checkbox()}
                  />
                  Mâle
                </label>
              </div>
            </div>

            <button type="submit" className={actionClassNames.standalone()}>
              Trouver un nom
            </button>
          </Form>
        </section>

        <section
          className={cn("flex flex-col items-center gap-12", "md:flex-1")}
        >
          {names.length === 0 ? (
            <p
              className={cn(
                "w-full py-12 text-center text-gray-500",
                "md:py-40",
              )}
            >
              Aucun nom trouvé.
            </p>
          ) : (
            <>
              <ul
                className={cn(
                  "grid w-full grid-cols-1 grid-rows-[auto] items-start gap-6",
                  "xs:grid-cols-2",
                  "sm:grid-cols-3",
                  "md:grid-cols-2 md:gap-y-12",
                  "lg:grid-cols-3",
                )}
              >
                {names.map((name) => (
                  <li
                    key={name.label}
                    className="flex items-center justify-center gap-1"
                  >
                    <span className="flex items-center text-[20px]">
                      <Icon
                        id="venus"
                        className={cn("text-pink-500", {
                          hidden: name.gender === Gender.MALE,
                        })}
                      />

                      <Icon
                        id="mars"
                        className={cn("text-brandBlue", {
                          hidden: name.gender === Gender.FEMALE,
                        })}
                      />
                    </span>

                    <span className="text-title-item">{name.label}</span>
                  </li>
                ))}
              </ul>

              <Form method="GET" replace preventScrollReset className="flex">
                <input type="hidden" name="l" value={params.l ?? ""} />
                <input type="hidden" name="g" value={params.g ?? ""} />

                <button
                  type="submit"
                  className={actionClassNames.standalone({ color: "gray" })}
                >
                  Voir d’autres noms
                </button>
              </Form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

const formClassNames = {
  field: () => "flex flex-col",
  label: () => "text-caption-default text-gray-500",
  checkboxLabel: () => "flex items-center gap-2 cursor-pointer",
  checkbox: () =>
    "appearance-none w-[14px] h-[14px] rounded-full ring-inset ring-gray-400 ring-1 checked:ring-4 checked:ring-brandBlue transition-shadow duration-100 ease-in-out",
};

function FirstLetterInput({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <input
      type="text"
      name="l"
      id="first-letter"
      value={value}
      onChange={(event) => {
        let value = (event.target.value.at(-1) ?? "").toUpperCase();
        if (!/^[A-Z]$/.test(value)) {
          value = "";
        }

        setValue(value);
      }}
      className="w-full border border-gray-200 px-6 py-2 rounded-bubble-sm"
    />
  );
}

const LoaderSearchParamsSchema = z.object({
  l: z
    .string()
    .regex(/^[A-Z]?$/)
    .optional()
    .transform((value) => value || null),
  g: z
    .union([z.literal(""), z.nativeEnum(Gender)])
    .optional()
    .transform((value) => value || null),
});

function getParams(searchParams: URLSearchParams) {
  const result = LoaderSearchParamsSchema.safeParse(
    Object.fromEntries(searchParams.entries()),
  );

  return result.success ? result.data : { l: null, g: null };
}

// Inspired by Faker's `arrayElements`.
// https://github.com/faker-js/faker/blob/v7.5.0/src/modules/helpers/index.ts#L431
function pickRandom<T>(names: T[], count: number) {
  count = Math.min(count, names.length);
  const arrayCopy = names.slice();

  for (let currentCount = 0; currentCount < count; currentCount++) {
    const index = Math.floor((names.length - currentCount) * Math.random());
    const temp = arrayCopy[index];
    invariant(temp != null, "First element should exists");

    const temp2 = arrayCopy[names.length - currentCount - 1];
    invariant(temp2 != null, "Second element should exists");

    arrayCopy[index] = temp2;
    arrayCopy[names.length - currentCount - 1] = temp;
  }

  return arrayCopy.slice(names.length - count);
}
