import { useConfig } from "#core/config.ts";
import { createCloudinaryUrl } from "#core/dataDisplay/image.tsx";
import type { InstanceColor } from "#core/dataDisplay/instanceColor.tsx";
import { Card } from "#core/layout/card.tsx";
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
    <div className="z-0 relative h-6 flex md:h-10">
      <span className="absolute top-0 left-0 w-full h-full backdrop-blur-3xl" />

      <img
        src={createCloudinaryUrl(cloudinaryName, imageId, {
          size: "128",
          aspectRatio: "1:1",
        })}
        alt={imageAlt}
        className="w-full h-full object-cover object-top"
      />
    </div>
  );
};

AvatarCard.BackgroundColor = function AvatarCardBackgroundColor({
  color,
}: {
  color: InstanceColor;
}) {
  return <div className={cn("h-6 flex md:h-10", BACKGROUND_COLOR[color])} />;
};

const BACKGROUND_COLOR: Record<InstanceColor, string> = {
  blue: "bg-blue-50",
  green: "bg-green-50",
  red: "bg-red-50",
  yellow: "bg-yellow-50",
};

AvatarCard.Content = function AvatarCardContent({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="z-0 p-1 flex gap-1 items-center md:p-2 md:gap-2">
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
    <span className="h-[45px] flex-none self-start flex items-end">
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
  return <div className="min-w-0 flex-1 flex flex-col gap-0.5">{children}</div>;
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
    className: cn("text-body-emphasis text-gray-500", children.props.className),
  });
};
