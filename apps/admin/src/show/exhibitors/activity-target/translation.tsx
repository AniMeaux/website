import { ShowActivityTarget } from "@prisma/client";

export const TRANSLATION_BY_ACTIVITY_TARGET: Record<
  ShowActivityTarget,
  string
> = {
  [ShowActivityTarget.CATS]: "Chats",
  [ShowActivityTarget.DOGS]: "Chiens",
  [ShowActivityTarget.EQUINES]: "Équidés",
  [ShowActivityTarget.HUMANS]: "Humains",
  [ShowActivityTarget.NACS]: "NACs",
  [ShowActivityTarget.RABBITS]: "Lapins",
  [ShowActivityTarget.WILDLIFE]: "Faune sauvage",
};
