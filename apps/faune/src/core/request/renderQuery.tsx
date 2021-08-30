import { PaginatedResponse } from "@animeaux/shared-entities";
import { ChildrenProp } from "core/types";
import { EmptyMessage, EmptyMessageProps } from "dataDisplay/emptyMessage";
import {
  ErrorActionRetry,
  ErrorMessage,
  ErrorMessageProps,
} from "dataDisplay/errorMessage";
import { Placeholder, Placeholders } from "loaders/placeholder";
import * as React from "react";
import { UseInfiniteQueryResult, UseQueryResult } from "./request";

type RetryButtonProps = ChildrenProp & {
  retry: () => void;
};

type EmptyMessageRendererProps = Pick<EmptyMessageProps, "children" | "action">;
type ErrorRendererProps = Pick<ErrorMessageProps, "type" | "action">;

type ItemListRenderers<ItemType> = {
  title?: string;
  emptyMessage: string;
  renderEmptyMessage?: (props: EmptyMessageRendererProps) => React.ReactNode;
  getItemKey: (item: ItemType) => string;
  renderItem: (item: ItemType) => React.ReactNode;
  renderPlaceholderItem: () => React.ReactNode;
  placeholderCount?: number;
  renderError?: (props: ErrorRendererProps) => React.ReactNode;
  retryButtonLabel?: string;
  renderRetryButton?: (props: RetryButtonProps) => React.ReactNode;
  renderAdditionalItem?: () => React.ReactNode;
};

function defaultRenderEmptyMessage(props: EmptyMessageRendererProps) {
  return <EmptyMessage {...props} />;
}

function defaultRenderError(props: ErrorRendererProps) {
  return <ErrorMessage {...props} />;
}

function defaultRenderRetryButton({ retry, children }: RetryButtonProps) {
  return <ErrorActionRetry onClick={retry}>{children}</ErrorActionRetry>;
}

const DEFAULT_RETRY_LABEL = "Réessayer";

function renderItemListContent<DataType>(
  query: UseQueryResult<DataType[], Error>,
  {
    emptyMessage,
    renderEmptyMessage = defaultRenderEmptyMessage,
    getItemKey,
    renderItem,
    renderPlaceholderItem,
    placeholderCount = 5,
    renderError = defaultRenderError,
    retryButtonLabel = DEFAULT_RETRY_LABEL,
    renderRetryButton = defaultRenderRetryButton,
    renderAdditionalItem,
  }: ItemListRenderers<DataType>
): React.ReactNode {
  if (query.data != null) {
    if (query.data.length === 0) {
      return (
        <>
          {renderAdditionalItem?.()}
          {renderEmptyMessage({ children: emptyMessage })}
        </>
      );
    }

    return (
      <>
        {renderAdditionalItem?.()}
        <ul>
          {query.data.map((item) => (
            <li key={getItemKey(item)}>{renderItem(item)}</li>
          ))}
        </ul>
      </>
    );
  }

  if (query.isLoading) {
    return (
      <>
        {renderAdditionalItem?.()}
        <ul>
          <Placeholders count={placeholderCount}>
            <li>{renderPlaceholderItem()}</li>
          </Placeholders>
        </ul>
      </>
    );
  }

  if (query.isError) {
    return renderError({
      type: "serverError",
      action: renderRetryButton({
        retry: () => query.refetch(),
        children: retryButtonLabel,
      }),
    });
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
  emptySearchMessage?: string;
  renderEmptySearchAction?: () => React.ReactNode;
};

function renderInfiniteItemListContent<ItemType>(
  query: UseInfiniteQueryResult<PaginatedResponse<ItemType>, Error>,
  {
    hasSearch = false,
    renderEmptyMessage = defaultRenderEmptyMessage,
    emptyMessage,
    emptySearchMessage,
    renderEmptySearchAction,
    getItemKey,
    renderItem,
    renderAdditionalItem,
    renderPlaceholderItem,
    placeholderCount = 5,
    renderError = defaultRenderError,
    retryButtonLabel = DEFAULT_RETRY_LABEL,
    renderRetryButton = defaultRenderRetryButton,
  }: InfiniteItemListRenderers<ItemType>
) {
  if (query.data != null) {
    // There is allways at least one page.
    if (query.data.pages[0].hits.length === 0) {
      let emptyMessageNode: React.ReactNode;

      if (hasSearch) {
        emptyMessageNode = renderEmptyMessage({
          children: emptySearchMessage ?? emptyMessage,
          action: renderEmptySearchAction?.(),
        });
      } else {
        emptyMessageNode = renderEmptyMessage({ children: emptyMessage });
      }

      return (
        <>
          {renderAdditionalItem?.()}
          {emptyMessageNode}
        </>
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
      <>
        {renderAdditionalItem?.()}

        <ul>
          {itemsNode}
          {renderPlaceholder && <li>{renderPlaceholderItem()}</li>}
        </ul>
      </>
    );
  }

  if (query.isLoading) {
    return (
      <>
        {renderAdditionalItem?.()}

        <ul>
          <Placeholders count={placeholderCount}>
            <li>{renderPlaceholderItem()}</li>
          </Placeholders>
        </ul>
      </>
    );
  }

  if (query.isError) {
    return renderError({
      type: "serverError",
      action: renderRetryButton({
        retry: () => query.refetch(),
        children: retryButtonLabel,
      }),
    });
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
    const errorMessage = (
      <ErrorMessage
        type="serverError"
        action={defaultRenderRetryButton({
          retry: () => query.refetch(),
          children: DEFAULT_RETRY_LABEL,
        })}
      />
    );

    return renderError == null ? errorMessage : renderError(errorMessage);
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
