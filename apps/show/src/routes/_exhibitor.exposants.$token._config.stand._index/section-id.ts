export type SectionId = (typeof SectionId)[keyof typeof SectionId];

export const SectionId = {
  DOGS: "chiens-sur-stand",
  PERKS: "avantages",
  PRICE: "prix",
  STAND: "configuration-de-stand",
} as const;
