import { ShowActivityTarget } from "@prisma/client";
import orderBy from "lodash.orderby";

export namespace ActivityTarget {
  export const Enum = ShowActivityTarget;
  export type Enum = ShowActivityTarget;

  export const translation: Record<Enum, string> = {
    [Enum.CATS]: "Chats",
    [Enum.DOGS]: "Chiens",
    [Enum.EQUINES]: "Équidés",
    [Enum.HUMANS]: "Humains",
    [Enum.NACS]: "NACs",
    [Enum.RABBITS]: "Lapins",
    [Enum.WILDLIFE]: "Faune sauvage",
  };

  export const values = orderBy(
    Object.values(Enum),
    (field) => translation[field],
  );
}
