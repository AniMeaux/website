import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { DynamicImage } from "~/dataDisplay/image";
import { LineShapeHorizontal } from "~/layout/lineShape";

export function RelatedSection({ children }: { children: React.ReactNode }) {
  return (
    <aside
      className={cn(
        "w-full pt-[72px] px-page pb-12 flex flex-col items-center gap-12",
        "md:py-12"
      )}
    >
      <div className={cn("w-full px-2 flex", "md:px-6")}>
        <LineShapeHorizontal
          className={cn("w-full h-4 text-gray-300", "md:h-6")}
        />
      </div>

      <div className="w-full flex flex-col gap-6">
        <h2
          className={cn(
            "text-title-section-small text-center",
            "md:text-title-section-large md:text-left"
          )}
        >
          Voir aussi
        </h2>

        <ul
          className={cn(
            "grid grid-cols-1 grid-rows-[auto] gap-6 items-start",
            "xs:grid-cols-2"
          )}
        >
          {children}
        </ul>
      </div>
    </aside>
  );
}

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
