import type { AvatarColor } from "#core/dataDisplay/avatar.tsx";
import { simpleHash } from "#core/simpleHash.tsx";
import invariant from "tiny-invariant";

const COLORS = [
  "blue-light",
  "green-light",
  "red-light",
  "yellow-light",
] satisfies AvatarColor[];

export type InstanceColor = (typeof COLORS)[number];

export function inferInstanceColor(uuid: string) {
  const color = COLORS[simpleHash(uuid) % COLORS.length];
  invariant(color != null, "Should return an existing color");
  return color;
}
