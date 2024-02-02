import type { AvatarColor } from "#core/data-display/avatar";
import { simpleHash } from "#core/simple-hash";
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
