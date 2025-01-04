import { ShowActivityTarget } from "@prisma/client";

export const ACTIVITY_TARGET_TRANSLATION: Record<ShowActivityTarget, string> = {
  [ShowActivityTarget.CATS]: "Chats",
  [ShowActivityTarget.DOGS]: "Chiens",
  [ShowActivityTarget.EQUINES]: "Équidés",
  [ShowActivityTarget.HUMANS]: "Humains",
  [ShowActivityTarget.NACS]: "NACs",
  [ShowActivityTarget.RABBITS]: "Lapins",
  [ShowActivityTarget.WILDLIFE]: "Faune sauvage",
};
