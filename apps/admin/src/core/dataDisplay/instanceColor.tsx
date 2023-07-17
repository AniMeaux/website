import invariant from "tiny-invariant";
import { simpleHash } from "~/core/simpleHash";

const COLORS = ["blue", "green", "red", "yellow"] as const;

export type InstanceColor = (typeof COLORS)[number];

export function inferInstanceColor(uuid: string) {
  const color = COLORS[simpleHash(uuid) % COLORS.length];
  invariant(color != null, "Should return an existing color");
  return color;
}
