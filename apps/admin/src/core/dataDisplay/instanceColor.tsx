const COLORS = ["blue", "green", "red", "yellow"] as const;

export type InstanceColor = (typeof COLORS)[number];

export function inferInstanceColor(uuid: string) {
  // We take the first 8 hexa characters.
  const hash = Number(`0x${uuid.substring(0, 8)}`);
  return COLORS[hash % COLORS.length];
}
