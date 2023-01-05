import { UserGroup } from "@prisma/client";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";

const SEARCH_COUNT = 6;

export async function searchUsers({
  displayName,
  groups,
  isDisabled,
}: {
  displayName: null | string;
  groups: UserGroup[];
  isDisabled: null | boolean;
}) {
  // Don't use Algolia when there are no text search.
  if (displayName == null) {
    const managers = await prisma.user.findMany({
      where: {
        groups: groups.length === 0 ? undefined : { hasSome: groups },
        isDisabled: isDisabled ?? undefined,
      },
      select: { id: true, displayName: true },
      orderBy: { displayName: "asc" },
      take: SEARCH_COUNT,
    });

    return managers.map((manager) => ({
      ...manager,
      highlightedDisplayName: manager.displayName,
    }));
  }

  return await algolia.user.search(
    displayName,
    { groups, isDisabled },
    { hitsPerPage: SEARCH_COUNT }
  );
}
