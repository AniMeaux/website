import { Icon } from "#i/generated/icon";
import { cn } from "@animeaux/core";
import { FosterFamilyEmergencies } from "@animeaux/prisma";
import type { Except } from "type-fest";

export const SORTED_EMERGENCIES = [
  FosterFamilyEmergencies.YES,
  FosterFamilyEmergencies.NO,
  FosterFamilyEmergencies.UNKNOWN,
];

export const EMERGENCIES_TRANSLATION: Record<FosterFamilyEmergencies, string> =
  {
    [FosterFamilyEmergencies.NO]: "Non",
    [FosterFamilyEmergencies.YES]: "Oui",
    [FosterFamilyEmergencies.UNKNOWN]: "Inconnu",
  };

export const ICON_BY_EMERGENCIES: Record<
  FosterFamilyEmergencies,
  React.ReactNode
> = {
  [FosterFamilyEmergencies.NO]: <Icon href="icon-tree-slash-solid" />,
  [FosterFamilyEmergencies.YES]: <Icon href="icon-tree-solid" />,
  [FosterFamilyEmergencies.UNKNOWN]: <Icon href="icon-tree-question-solid" />,
};

export function EmergenciesIcon({
  emergencies,
  className,
  ...props
}: Except<React.ComponentPropsWithoutRef<typeof Icon>, "href"> & {
  emergencies: FosterFamilyEmergencies;
}) {
  return (
    <Icon
      {...props}
      href="icon-status-solid"
      className={cn(ICON_CLASS_NAMES_BY_EMERGENCIES[emergencies], className)}
    />
  );
}

const ICON_CLASS_NAMES_BY_EMERGENCIES: Record<FosterFamilyEmergencies, string> =
  {
    [FosterFamilyEmergencies.YES]: cn("text-green-600"),
    [FosterFamilyEmergencies.NO]: cn("text-red-500"),
    [FosterFamilyEmergencies.UNKNOWN]: cn("text-gray-800"),
  };
