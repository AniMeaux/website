import { algolia } from "#/core/algolia/algolia.server";
import { prisma } from "#/core/db.server";
import { UserSearchParams } from "#/users/searchParams";

const SEARCH_COUNT = 6;

export async function searchUsers(searchParams: UserSearchParams) {
  const text = searchParams.getText();
  const group = searchParams.getGroup();
  const isDisabled = searchParams.getIsDisabled();

  // Don't use Algolia when there are no text search.
  if (text == null) {
    const managers = await prisma.user.findMany({
      where: {
        groups: group == null ? undefined : { has: group },
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
    text,
    { groups: group, isDisabled },
    { hitsPerPage: SEARCH_COUNT }
  );
}
