import type { BaseLinkProps } from "#core/baseLink.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { useConfig } from "#core/config.ts";
import type { IconProps } from "#generated/icon.tsx";
import { Icon } from "#generated/icon.tsx";
import { cn } from "@animeaux/core";

export function SocialLinks({ className }: { className?: string }) {
  const { facebookUrl, instagramUrl, linkedInUrl, twitterUrl } = useConfig();

  return (
    <div className={cn(className, "flex gap-1")}>
      <SocialLink
        to={facebookUrl}
        icon="facebook"
        title="Page Facebook"
        className="hover:bg-facebook hover:text-facebook"
      />

      <SocialLink
        to={instagramUrl}
        icon="instagram"
        title="Compte Instagram"
        className="hover:bg-instagram hover:text-instagram"
      />

      <SocialLink
        to={linkedInUrl}
        icon="linkedin"
        title="Page LinkedIn"
        className="hover:bg-linkedin hover:text-linkedin"
      />

      <SocialLink
        to={twitterUrl}
        icon="twitter"
        title="Compte Twitter"
        className="hover:bg-twitter hover:text-twitter"
      />
    </div>
  );
}

function SocialLink({
  to,
  title,
  icon,
  className,
}: {
  to: BaseLinkProps["to"];
  title: BaseLinkProps["title"];
  icon: IconProps["id"];
  className: string;
}) {
  return (
    <BaseLink
      to={to}
      title={title}
      className={cn(
        className,
        "rounded-bubble-sm bg-opacity-0 p-2 flex items-center text-gray-700 hover:bg-opacity-10 transition-colors duration-100 ease-in-out",
      )}
    >
      <Icon id={icon} />
    </BaseLink>
  );
}
