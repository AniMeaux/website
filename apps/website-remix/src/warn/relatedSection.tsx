import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { DynamicImage } from "~/dataDisplay/image";

export function WarnItem({
  to,
  image,
  title,
  description,
}: {
  to: BaseLinkProps["to"];
  image: string;
  title: string;
  description: string;
}) {
  return (
    <li className="flex">
      <BaseLink
        to={to}
        className={cn(
          "w-full px-4 py-3 shadow-none rounded-bubble-lg bg-transparent flex flex-col gap-3 transition-[background-color,transform] duration-100 ease-in-out hover:bg-white hover:shadow-base",
          "md:p-6"
        )}
      >
        <DynamicImage
          shouldFill
          imageId={image}
          alt={title}
          sizes={{ lg: "300px", md: "30vw", xs: "50vw", default: "100vw" }}
          fallbackSize="512"
          className="w-full aspect-4/3 flex-none rounded-bubble-ratio"
        />

        <div className="flex flex-col">
          <p className="text-title-item">{title}</p>
          <p>{description}</p>
        </div>
      </BaseLink>
    </li>
  );
}
