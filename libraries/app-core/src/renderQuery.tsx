import { PaginatedResponse } from "@animeaux/shared-entities";
import {
  Button,
  EmptyMessage,
  Placeholder,
  Placeholders,
  Section,
} from "@animeaux/ui-library";
import * as React from "react";
import { ErrorPage } from "./errorPage";
import { UseInfiniteQueryResult, UseQueryResult } from "./request";

type RetryButtonProps = {
  query: UseQueryResult<any, any>;
};

function RetryButton({ query }: RetryButtonProps) {
  return (
    <Button variant="primary" color="blue" onClick={() => query.refetch()}>
      Réessayer
    </Button>
  );
}

type ItemListRenderers<ItemType> = {
  title?: string;
  renderEmptyMessage: () => React.ReactNode;
  getItemKey: (item: ItemType) => string;
  renderItem: (item: ItemType) => React.ReactNode;
  placeholderElement: React.ElementType;
};

function renderItemListContent<DataType>(
  query: UseQueryResult<DataType[], Error>,
  {
    renderEmptyMessage,
    getItemKey,
    renderItem,
    placeholderElement: PlaceholderElement,
  }: ItemListRenderers<DataType>
): React.ReactNode {
  if (query.data != null) {
    if (query.data.length === 0) {
      return (
        <Section>
          <EmptyMessage>{renderEmptyMessage()}</EmptyMessage>
        </Section>
      );
    }

    return (
      <Section>
        <ul>
          {query.data.map((item) => (
            <li key={getItemKey(item)}>{renderItem(item)}</li>
          ))}
        </ul>
      </Section>
    );
  }

  if (query.isLoading) {
    return (
      <Section>
        <ul>
          <Placeholders count={5}>
            <li>
              <PlaceholderElement />
            </li>
          </Placeholders>
        </ul>
      </Section>
    );
  }

  if (query.isError) {
    return (
      <ErrorPage error={query.error} action={<RetryButton query={query} />} />
    );
  }

  return null;
}

export function renderItemList<DataType>(
  query: UseQueryResult<DataType[], Error>,
  renderers: ItemListRenderers<DataType>
) {
  return {
    content: renderItemListContent(query, renderers),
    title:
      renderers.title == null || query.data == null
        ? renderers.title
        : `${renderers.title} (${query.data.length})`,
  };
}

type InfiniteItemListRenderers<ItemType> = ItemListRenderers<ItemType> & {
  hasSearch?: boolean;
  renderAdditionalItem?: () => React.ReactNode;
  renderEmptySearchMessage?: () => React.ReactNode;
  renderEmptySearchAction?: () => React.ReactNode;
};

function renderInfiniteItemListContent<ItemType>(
  query: UseInfiniteQueryResult<PaginatedResponse<ItemType>, Error>,
  {
    hasSearch = false,
    renderEmptyMessage,
    renderEmptySearchMessage,
    renderEmptySearchAction,
    getItemKey,
    renderItem,
    renderAdditionalItem,
    placeholderElement: PlaceholderElement,
  }: InfiniteItemListRenderers<ItemType>
) {
  if (query.data != null) {
    // There is allways at least one page.
    if (query.data.pages[0].hits.length === 0) {
      let emptyMessage: React.ReactNode;

      if (hasSearch) {
        emptyMessage = (
          <EmptyMessage action={renderEmptySearchAction?.()}>
            {(renderEmptySearchMessage ?? renderEmptyMessage)()}
          </EmptyMessage>
        );
      } else {
        emptyMessage = <EmptyMessage>{renderEmptyMessage()}</EmptyMessage>;
      }

      return (
        <Section>
          {renderAdditionalItem?.()}
          {emptyMessage}
        </Section>
      );
    }

    const itemsNode: React.ReactNode[] = [];
    query.data.pages.forEach((page) => {
      page.hits.forEach((item) => {
        itemsNode.push(<li key={getItemKey(item)}>{renderItem(item)}</li>);
      });
    });

    // Use `hasNextPage` instead of `isFetchingNextPage` to avoid changing the
    // page height during a scroll when the placeholder is rendered.
    // This is ok because the placeholder will only be visible when the scroll
    // is in a fetch more position.
    const renderPlaceholder = query.hasNextPage ?? false;

    return (
      <Section>
        <ul>
          {renderAdditionalItem?.()}
          {itemsNode}
          {renderPlaceholder && (
            <li>
              <PlaceholderElement />
            </li>
          )}
        </ul>
      </Section>
    );
  }

  if (query.isLoading) {
    return (
      <Section>
        <ul>
          {renderAdditionalItem?.()}
          <Placeholders count={5}>
            <li>
              <PlaceholderElement />
            </li>
          </Placeholders>
        </ul>
      </Section>
    );
  }

  if (query.isError) {
    return (
      <ErrorPage error={query.error} action={<RetryButton query={query} />} />
    );
  }

  return null;
}

export function renderInfiniteItemList<ItemType>(
  query: UseInfiniteQueryResult<PaginatedResponse<ItemType>, Error>,
  renderers: InfiniteItemListRenderers<ItemType>
) {
  return {
    content: renderInfiniteItemListContent(query, renderers),
    title:
      renderers.title == null || query.data == null
        ? renderers.title
        : // There is allways at least one page.
          `${renderers.title} (${query.data.pages[0].hitsTotalCount})`,
  };
}

type EntityQueryRenderers<EntityType> = {
  getDisplayedText: (entity: EntityType) => string;
  renderEntity: (entity: EntityType) => React.ReactNode;
  renderPlaceholder: () => React.ReactNode;
  renderError?: (errorPage: React.ReactNode) => React.ReactNode;
};

function renderQueryEntityContent<EntityType>(
  query: UseQueryResult<EntityType | null, Error>,
  {
    renderEntity,
    renderPlaceholder,
    renderError,
  }: EntityQueryRenderers<EntityType>
): React.ReactNode {
  if (query.data != null) {
    return renderEntity(query.data);
  }

  if (query.isLoading) {
    return renderPlaceholder();
  }

  if (query.isError) {
    const errorPage = (
      <ErrorPage error={query.error} action={<RetryButton query={query} />} />
    );

    return renderError == null ? errorPage : renderError(errorPage);
  }

  return null;
}

export function renderQueryEntity<EntityType>(
  query: UseQueryResult<EntityType | null, Error>,
  renderers: EntityQueryRenderers<EntityType>
) {
  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;

  if (query.data != null) {
    pageTitle = renderers.getDisplayedText(query.data);
    headerTitle = pageTitle;
  } else if (query.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (query.isError != null) {
    pageTitle = "Oups";
  }

  return {
    pageTitle,
    headerTitle,
    content: renderQueryEntityContent(query, renderers),
  };
}
