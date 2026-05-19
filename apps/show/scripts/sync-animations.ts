import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

import type { Prisma } from "@animeaux/prisma/server"
import {
  PrismaClient,
  ShowActivityTarget,
  ShowStandZone,
} from "@animeaux/prisma/server"
import { simpleUrl, zu } from "@animeaux/zod-utils"
import { csvParse } from "d3-dsv"
import { isEqual, orderBy } from "es-toolkit"
import invariant from "tiny-invariant"

const csvPath = process.argv[2]
invariant(csvPath != null, "Missing path to CSV file in command line.")

console.log("🔄 Synchronising animations...")

const prisma = new PrismaClient()

try {
  const inputs = await getInputs(csvPath)

  const animationsIds = new Set<string>()

  for (const input of inputs) {
    animationsIds.add(input.id)

    await upsertAnimation(input)
  }

  await deleteRemovedAnimations(animationsIds)

  console.log("🎉 Animations synchronised")
} finally {
  await prisma.$disconnect()
}

async function getInputs(csvPath: string) {
  const exhibitors = await prisma.showExhibitor.findMany({
    select: { id: true, name: true },
  })

  const exhibitorsByName = new Map(
    exhibitors.map((exhibitor) => [exhibitor.name, exhibitor]),
  )

  const csvContent = await readFile(resolve(process.cwd(), csvPath), "utf-8")
  const rows = csvParse(csvContent)

  const parsedInputs = zu
    .array(createInputSchema(exhibitorsByName))
    .safeParse(rows)

  if (!parsedInputs.success) {
    console.error(`Invalid CSV data:\n${formatErrors(parsedInputs.error)}`)

    process.exit(1)
  }

  return parsedInputs.data
}

type Input = zu.infer<ReturnType<typeof createInputSchema>>

function createInputSchema(
  exhibitorsByName: Map<string, { id: string; name: string }>,
) {
  return zu.object({
    id: zu.string().uuid(),
    description: zu.string().trim().min(1),
    startTime: zu.coerce.date(),
    endTime: zu.coerce.date(),
    zone: zu.nativeEnum(ShowStandZone),
    targets: zu
      .preprocess(parsePipeArray, zu.array(zu.nativeEnum(ShowActivityTarget)))
      .transform((targets) => targets.sort()),
    registrationUrl: zu.preprocess(
      (value) => (value === "" ? null : value),
      simpleUrl().pipe(zu.string().max(128)).nullable(),
    ),
    animators: zu
      .preprocess(parsePipeArray, zu.array(zu.string()))
      .transform((names) => {
        const maybeAnimators = names.map((name) => exhibitorsByName.get(name))
        const animators = maybeAnimators.filter(Boolean)

        if (maybeAnimators.length !== animators.length) {
          return null
        }

        return orderBy(animators, [(animator) => animator.id], ["asc"])
      }),
  })
}

function parsePipeArray(value: unknown) {
  if (typeof value !== "string") {
    return value
  }

  return value
    .split("|")
    .map((value) => value.trim())
    .filter(Boolean)
}

function formatErrors(error: zu.ZodError) {
  return error.issues
    .map((issue) => `- \`${issue.path.join(".")}\`: ${issue.message}`)
    .join("\n")
}

async function upsertAnimation(input: Input) {
  const description = truncateDescription(input.description)

  if (input.animators == null) {
    console.warn(
      `- ⚠️ Skipping animation "${description}": exhibitor name not found`,
    )

    return
  }

  const currentAnimation = await prisma.showAnimation.findUnique({
    where: { id: input.id },
    select: {
      animators: { select: { id: true, name: true }, orderBy: { id: "asc" } },
      description: true,
      endTime: true,
      id: true,
      registrationUrl: true,
      startTime: true,
      targets: true,
      zone: true,
    },
  })

  const payload = {
    description: input.description,
    startTime: input.startTime,
    endTime: input.endTime,
    zone: input.zone,
    targets: input.targets,
    registrationUrl: input.registrationUrl,
  } satisfies Prisma.ShowAnimationUpdateInput

  if (currentAnimation == null) {
    await prisma.showAnimation.create({
      data: {
        ...payload,
        id: input.id,
        animators: { connect: input.animators },
      },
      select: { id: true },
    })

    console.log(`- ✅ Created animation "${description}"`)

    return
  }

  currentAnimation.targets.sort()

  if (isEqual(currentAnimation, input)) {
    console.log(`- 🤷 Skipped animation "${description}": no changes`)

    return
  }

  await prisma.showAnimation.update({
    where: { id: input.id },
    data: { ...payload, animators: { set: input.animators } },
    select: { id: true },
  })

  console.log(`- 🔄 Updated animation "${description}"`)
}

function truncateDescription(value: string, length = 20) {
  return value.length > length ? `${value.slice(0, length)}…` : value
}

async function deleteRemovedAnimations(animationsIds: Set<string>) {
  const toDelete = await prisma.showAnimation.findMany({
    where: { id: { notIn: Array.from(animationsIds) } },
    select: { id: true, description: true },
  })

  if (toDelete.length === 0) {
    return
  }

  await prisma.showAnimation.deleteMany({
    where: { id: { in: toDelete.map(({ id }) => id) } },
  })

  console.log(
    toDelete
      .map(
        (animation) =>
          `- 🗑️ Deleted animation "${truncateDescription(animation.description)}"`,
      )
      .join("\n"),
  )
}
