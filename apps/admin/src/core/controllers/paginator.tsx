import type { BaseLinkProps } from "#i/core/base-link";
import { BaseLink } from "#i/core/base-link";
import { PageSearchParams } from "#i/core/search-params";
import { cn } from "@animeaux/core";
import { useSearchParams } from "@remix-run/react";
import type { ReactNode } from "react";

export function Paginator({
  pageCount,
  className,
}: {
  pageCount: number;
  className?: string;
}) {
  const [searchParams] = useSearchParams();
  const { page } = PageSearchParams.parse(searchParams);

  const items: ReactNode[] = [];
  for (let index = 0; index < pageCount; index++) {
    items.push(
      <PaginatorItem
        key={index}
        isActive={page === index}
        to={{
          search: PageSearchParams.set(new URLSearchParams(searchParams), {
            page: index,
          }).toString(),
        }}
      >
        {index + 1}
      </PaginatorItem>,
    );
  }

  if (pageCount - page >= 4) {
    items.splice(
      page + 2,
      pageCount - page - 3,
      <PaginatorItem key={pageCount - 2} isEllipsis>
        …
      </PaginatorItem>,
    );
  }

  if (page >= 3) {
    items.splice(
      1,
      page - 2,
      <PaginatorItem key={1} isEllipsis>
        …
      </PaginatorItem>,
    );
  }

  return (
    <ul className={cn(className, "flex items-center gap-0.5")}>{items}</ul>
  );
}

function PaginatorItem({
  to,
  isActive = false,
  isEllipsis = false,
  children,
}: {
  to?: BaseLinkProps["to"];
  isActive?: boolean;
  isEllipsis?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-none">
      <BaseLink
        to={isActive ? undefined : to}
        className={cn(
          "flex transition-colors duration-100 ease-in-out text-caption-emphasis",
          { "rounded-0.5 px-1": !isEllipsis },
          {
            "bg-blue-500 text-white": isActive,
            "text-gray-500": !isActive,
            "hover:bg-gray-200": !isActive && to != null,
          },
        )}
      >
        {children}
      </BaseLink>
    </li>
  );
}
