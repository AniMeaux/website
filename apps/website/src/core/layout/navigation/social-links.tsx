import { cn } from "@animeaux/core"

import type { BaseLinkProps } from "#i/core/base-link.js"
import { BaseLink } from "#i/core/base-link.js"
import type { IconProps } from "#i/generated/icon.js"
import { Icon } from "#i/generated/icon.js"

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn(className, "flex gap-1")}>
      <SocialLink
        to={CLIENT_ENV.FACEBOOK_URL}
        icon="facebook"
        title="Page Facebook"
        className="hover:bg-social-facebook/10 hover:text-social-facebook"
      />

      <SocialLink
        to={CLIENT_ENV.INSTAGRAM_URL}
        icon="instagram"
        title="Compte Instagram"
        className="hover:bg-social-instagram/10 hover:text-social-instagram"
      />

      <SocialLink
        to={CLIENT_ENV.LINKEDIN_URL}
        icon="linkedin"
        title="Page LinkedIn"
        className="hover:bg-social-linkedin/10 hover:text-social-linkedin"
      />

      <SocialLink
        to={CLIENT_ENV.TWITTER_URL}
        icon="twitter"
        title="Compte Twitter"
        className="hover:bg-social-twitter/10 hover:text-social-twitter"
      />
    </div>
  )
}

function SocialLink({
  to,
  title,
  icon,
  className,
}: {
  to: BaseLinkProps["to"]
  title: BaseLinkProps["title"]
  icon: IconProps["id"]
  className: string
}) {
  return (
    <BaseLink
      to={to}
      title={title}
      className={cn(
        className,
        "flex items-center rounded-bubble-sm bg-transparent p-2 text-gray-700 transition-colors",
      )}
    >
      <Icon id={icon} />
    </BaseLink>
  )
}
