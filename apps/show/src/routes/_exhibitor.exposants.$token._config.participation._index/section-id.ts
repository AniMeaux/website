export type SectionId = (typeof SectionId)[keyof typeof SectionId];

export const SectionId = {
  DOGS: "chiens-sur-stand",
  ON_STAGE_ANIMATIONS: "animations-sur-scene",
  ON_STAND_ANIMATIONS: "animations-sur-stand",
  PERKS: "avantages",
  PRICE: "prix",
  STAND: "configuration-de-stand",
} as const;
