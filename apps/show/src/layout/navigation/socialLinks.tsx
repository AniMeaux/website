import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { Icon, IconProps } from "~/generated/icon";

export function SocialLinks({ className }: { className?: string }) {
  const { facebookUrl, instagramUrl } = useConfig();

  return (
    <div className={cn(className, "flex gap-1")}>
      <SocialLink
        to={facebookUrl}
        icon="facebook"
        title="Page Facebook"
        className="hover:bg-[#3774dc] hover:text-[#3774dc]"
      />

      <SocialLink
        to={instagramUrl}
        icon="instagram"
        title="Compte Instagram"
        className="hover:bg-[#ad3d7a] hover:text-[#ad3d7a]"
      />
    </div>
  );
}

function SocialLink({
  icon,
  className,
  ...rest
}: Omit<BaseLinkProps, "className"> & {
  icon: IconProps["id"];
  className: string;
}) {
  return (
    <BaseLink
      {...rest}
      className={cn(
        className,
        "rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg bg-opacity-0 p-2 flex items-center text-gray-700 hover:bg-opacity-10 transition-colors duration-100 ease-in-out"
      )}
    >
      <Icon id={icon} />
    </BaseLink>
  );
}
