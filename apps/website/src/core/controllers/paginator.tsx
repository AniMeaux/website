import type { BaseLinkProps } from "#core/baseLink";
import { BaseLink } from "#core/baseLink";
import { getPage, setPage } from "#core/searchParams";
import { cn } from "@animeaux/core";
import { useSearchParams } from "@remix-run/react";
import type { ReactNode } from "react";

export function Paginator({
  pageCount,
  className,
}: {
  pageCount: number;
  className: string;
}) {
  const [searchParams] = useSearchParams();
  if (pageCount < 2) {
    return null;
  }

  const page = getPage(searchParams);

  const items: ReactNode[] = [];

  for (let index = 0; index < pageCount; index++) {
    items.push(
      <PaginatorItem
        key={index}
        isActive={page === index}
        to={{ search: setPage(new URLSearchParams(), index).toString() }}
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
        ...
      </PaginatorItem>,
    );
  }

  if (page >= 3) {
    items.splice(
      1,
      page - 2,
      <PaginatorItem key={1} isEllipsis>
        ...
      </PaginatorItem>,
    );
  }

  return <ul className={cn(className, "flex gap-1 text-gray-500")}>{items}</ul>;
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
          "h-[40px]",
          {
            "w-[40px] rounded-bubble-sm": !isEllipsis,
          },
          "flex items-center justify-center transition-colors duration-100 ease-in-out text-body-emphasis",
          {
            "bg-brandBlue text-white": isActive,
            "hover:bg-gray-200": !isActive && to != null,
          },
        )}
      >
        {children}
      </BaseLink>
    </li>
  );
}
