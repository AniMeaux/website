import { useSearchParams } from "@remix-run/react";
import { ReactNode } from "react";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { PageSearchParams } from "~/core/params";

export function Paginator({
  pageCount,
  className,
}: {
  pageCount: number;
  className?: string;
}) {
  const [searchParams] = useSearchParams();
  const pageSearchParams = new PageSearchParams(searchParams);
  const page = pageSearchParams.getPage();

  const items: ReactNode[] = [];
  for (let index = 0; index < pageCount; index++) {
    items.push(
      <PaginatorItem
        key={index}
        isActive={page === index}
        to={{
          search: pageSearchParams.setPage(index).toString(),
        }}
      >
        {index + 1}
      </PaginatorItem>
    );
  }

  if (pageCount - page >= 4) {
    items.splice(
      page + 2,
      pageCount - page - 3,
      <PaginatorItem key={pageCount - 2} isEllipsis>
        …
      </PaginatorItem>
    );
  }

  if (page >= 3) {
    items.splice(
      1,
      page - 2,
      <PaginatorItem key={1} isEllipsis>
        …
      </PaginatorItem>
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
    <li className="flex-none flex">
      <BaseLink
        to={to}
        disabled={isActive}
        className={cn(
          "flex text-caption-emphasis transition-colors duration-100 ease-in-out",
          { "px-1 rounded-0.5": !isEllipsis },
          {
            "bg-blue-500 text-white": isActive,
            "text-gray-500": !isActive,
            "hover:bg-gray-200": !isActive && to != null,
          }
        )}
      >
        {children}
      </BaseLink>
    </li>
  );
}
