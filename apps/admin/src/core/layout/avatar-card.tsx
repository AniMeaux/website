import { useConfig } from "#core/config";
import type { AvatarColor } from "#core/data-display/avatar";
import { createCloudinaryUrl } from "#core/data-display/image";
import { Card } from "#core/layout/card";
import { cn } from "@animeaux/core";
import { cloneElement } from "react";

export function AvatarCard({ children }: { children?: React.ReactNode }) {
  return <Card>{children}</Card>;
}

AvatarCard.BackgroundImage = function AvatarCardBackgroundImage({
  imageId,
  imageAlt,
}: {
  imageId: string;
  imageAlt: string;
}) {
  const { cloudinaryName } = useConfig();

  return (
    <div className="relative z-0 flex h-6 md:h-10">
      <span className="absolute left-0 top-0 h-full w-full backdrop-blur-3xl" />

      <img
        src={createCloudinaryUrl(cloudinaryName, imageId, {
          size: "128",
          aspectRatio: "1:1",
        })}
        alt={imageAlt}
        className="h-full w-full object-cover object-top"
      />
    </div>
  );
};

AvatarCard.BackgroundColor = function AvatarCardBackgroundColor({
  color,
}: {
  color: AvatarColor;
}) {
  return (
    <div
      className={cn(
        "flex h-6 md:h-10",
        BACKGROUND_CLASS_NAME_BY_AVATAR_COLOR[color],
      )}
    />
  );
};

const BACKGROUND_CLASS_NAME_BY_AVATAR_COLOR: Record<AvatarColor, string> = {
  blue: cn("bg-blue-50"),
  "blue-light": cn("bg-blue-50"),
  gray: cn("bg-gray-50"),
  "gray-light": cn("bg-gray-50"),
  green: cn("bg-green-50"),
  "green-light": cn("bg-green-50"),
  red: cn("bg-red-50"),
  "red-light": cn("bg-red-50"),
  yellow: cn("bg-yellow-50"),
  "yellow-light": cn("bg-yellow-50"),
};

AvatarCard.Content = function AvatarCardContent({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="z-0 flex items-center gap-1 p-1 md:gap-2 md:p-2">
      {children}
    </div>
  );
};

AvatarCard.Avatar = function AvatarCardAvatar({
  children,
}: {
  children: React.ReactElement<{ className?: string }>;
}) {
  return (
    <span className="flex h-[45px] flex-none items-end self-start">
      {cloneElement(children, {
        className: cn("ring-5 ring-white", children.props.className),
      })}
    </span>
  );
};

AvatarCard.Lines = function AvatarCardLines({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div className="flex min-w-0 flex-1 flex-col gap-0.5">{children}</div>;
};

AvatarCard.FirstLine = function AvatarCardFirstLine({
  children,
}: {
  children: React.ReactElement<{ className?: string }>;
}) {
  return cloneElement(children, {
    className: cn(
      "text-title-section-small md:text-title-section-large",
      children.props.className,
    ),
  });
};

AvatarCard.SecondLine = function AvatarCardSecondLine({
  children,
}: {
  children: React.ReactElement<{ className?: string }>;
}) {
  return cloneElement(children, {
    className: cn("text-gray-500 text-body-emphasis", children.props.className),
  });
};
