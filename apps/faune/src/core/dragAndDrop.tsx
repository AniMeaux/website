import { ChildrenProp } from "core/types";
import invariant from "invariant";
import * as React from "react";
import {
  DndProvider,
  DragLayerMonitor,
  DragObjectWithType,
  useDrag,
  useDragLayer,
  useDrop,
  XYCoord,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useIsTouchScreen } from "ui/touchScreen";

export enum DragAndDropDirection {
  HORIZONTAL,
  VERTICAL,
}

type ProviderState = {
  pendingDropIndex: number | null;
  draggedIndex: number | null;
  draggedElementInitialRect: DOMRect | null;
};

export type DragAndDropContextValue = ProviderState & {
  itemType: string;
  startDrag: (index: number, draggedElementInitialRect: DOMRect) => void;
  endDrag: () => void;
  hoverItem: (index: number | null) => void;
  disabled: boolean;
  direction: DragAndDropDirection;
};

const DragAndDropContext = React.createContext<DragAndDropContextValue | null>(
  null
);

export function useDragAndDropContext(functionCallerName: string) {
  const context = React.useContext(DragAndDropContext);

  invariant(
    context != null,
    `${functionCallerName} can only be used inside a DragAndDropContextProvider.`
  );

  return context;
}

const INITIAL_STATE: ProviderState = {
  draggedElementInitialRect: null,
  pendingDropIndex: null,
  draggedIndex: null,
};

type DragAndDropContextProviderProps = ChildrenProp & {
  itemType: string;
  previewElement: React.ElementType;
  disabled?: boolean;
  direction?: DragAndDropDirection;
};

export function DragAndDropContextProvider({
  itemType,
  previewElement: PreviewElement,
  disabled = false,
  direction = DragAndDropDirection.HORIZONTAL,
  children,
}: DragAndDropContextProviderProps) {
  const [state, dispatch] = React.useState(INITIAL_STATE);

  const startDrag = React.useCallback<DragAndDropContextValue["startDrag"]>(
    (draggedIndex, draggedElementInitialRect) => {
      // If we don't dispatch on next tick the drag ends immediately.
      // Maybe due to fast DOM change during the native event?
      setTimeout(() => {
        dispatch({
          pendingDropIndex: draggedIndex,
          draggedIndex,
          draggedElementInitialRect,
        });
      });
    },
    []
  );

  const endDrag = React.useCallback<DragAndDropContextValue["endDrag"]>(() => {
    dispatch(INITIAL_STATE);
  }, []);

  const hoverItem = React.useCallback<DragAndDropContextValue["hoverItem"]>(
    (pendingDropIndex) => {
      dispatch((state) => {
        if (state.pendingDropIndex === pendingDropIndex) {
          // Preserve the current reference.
          return state;
        }

        return { ...state, pendingDropIndex };
      });
    },
    []
  );

  const value = React.useMemo<DragAndDropContextValue>(
    () => ({
      ...state,
      startDrag,
      endDrag,
      hoverItem,
      itemType,
      disabled,
      direction,
    }),
    [state, startDrag, endDrag, hoverItem, itemType, disabled, direction]
  );

  const { isTouchScreen } = useIsTouchScreen();
  const backend = isTouchScreen ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backend}>
      <DragAndDropContext.Provider value={value}>
        {children}

        {
          // Only use custom preview for touch screens.
          isTouchScreen && <PreviewElement />
        }
      </DragAndDropContext.Provider>
    </DndProvider>
  );
}

type DragItem<DataType> = DragObjectWithType & {
  index: number;
  data: DataType;
};

type UseDropContainerParameters<DataType> = {
  containerRef: React.MutableRefObject<HTMLElement>;
  setItems: React.Dispatch<React.SetStateAction<DataType[]>>;
};

export function useDropContainer<DataType>({
  containerRef,
  setItems,
}: UseDropContainerParameters<DataType>) {
  const {
    itemType,
    pendingDropIndex,
    hoverItem,
    disabled,
  } = useDragAndDropContext("useDropContainer");

  const [{ isOver }, drop] = useDrop<
    DragItem<DataType>,
    void,
    { isOver: boolean }
  >({
    accept: itemType,
    collect: (monitor) => ({ isOver: monitor.isOver() }),
    canDrop: () => !disabled && pendingDropIndex != null,
    drop: (draggedItem) => {
      // We dont call `endDrag` here, it is done in the `end` method of the
      // item's `useDrag`.

      // Dropping an item at its current index or current index + 1 is a NOP.
      if (
        pendingDropIndex != null &&
        pendingDropIndex !== draggedItem.index &&
        pendingDropIndex !== draggedItem.index + 1
      ) {
        setItems((items) => {
          const newItems = items.slice();
          const [item] = newItems.splice(draggedItem.index, 1);

          let insertionIndex = pendingDropIndex;

          if (draggedItem.index < pendingDropIndex) {
            // We just removed the item at a lower index so we need to shift
            // the insertion index.
            insertionIndex -= 1;
          }

          newItems.splice(insertionIndex, 0, item);

          return newItems;
        });
      }
    },
  });

  // The `drop` function support passing React.RefObject.
  // https://github.com/react-dnd/react-dnd/blob/master/packages/core/react-dnd/src/common/TargetConnector.ts#L13
  drop(containerRef);

  React.useEffect(() => {
    if (!isOver) {
      hoverItem(null);
    }
  }, [isOver, hoverItem]);

  return { pendingDropIndex };
}

type UseDragItemParameters<DataType> = {
  data: DataType;
  index: number;
  itemRef: React.MutableRefObject<HTMLElement>;
  handleRef?: React.MutableRefObject<HTMLElement>;
};

export function useDragItem<DataType>({
  data,
  index,
  itemRef,
  handleRef,
}: UseDragItemParameters<DataType>) {
  const {
    itemType,
    startDrag,
    pendingDropIndex,
    draggedIndex,
    endDrag,
    hoverItem,
    disabled,
    direction,
  } = useDragAndDropContext("useDragItem");

  const [, drag] = useDrag<DragItem<DataType>, void, void>({
    item: { type: itemType, index, data },
    canDrag: () => !disabled,
    begin: () => startDrag(index, itemRef.current.getBoundingClientRect()),

    // Reset the drag and drop when either a drop was done or not.
    end: () => endDrag(),
  });

  const [, drop] = useDrop<DragItem<DataType>, void, void>({
    accept: itemType,

    // The drop is handled at the container level.
    // We just need to update the `pendingDropIndex` at the item level.
    canDrop: () => false,

    hover: (draggedItem, monitor) => {
      // TODO: Use the center of the preview element instead of the pointer
      // position for the computation.
      // It would be more intuative for the user.
      const pointerPosition = monitor.getClientOffset();

      // The `hover` method is called even when `canDrop` return `false`.
      if (!disabled && itemRef.current != null && pointerPosition != null) {
        const itemRect = itemRef.current.getBoundingClientRect();

        let itemMiddle: number;
        let offsetInItem: number;
        if (direction === DragAndDropDirection.HORIZONTAL) {
          itemMiddle = (itemRect.right - itemRect.left) / 2;
          offsetInItem = pointerPosition.x - itemRect.left;
        } else {
          itemMiddle = (itemRect.bottom - itemRect.top) / 2;
          offsetInItem = pointerPosition.y - itemRect.top;
        }

        let pendingDropIndex: number;
        if (offsetInItem < itemMiddle) {
          // Drop `draggedItem` before the this item.
          pendingDropIndex = index;
        } else {
          // Drop `draggedItem` after the this item.
          pendingDropIndex = index + 1;
        }

        // Dropping the `draggedItem` at its current index or current index + 1
        // is the same.
        // So in both case we use the current index.
        if (pendingDropIndex === draggedItem.index + 1) {
          pendingDropIndex = draggedItem.index;
        }

        hoverItem(pendingDropIndex);
      }
    },
  });

  // The `drop` and `drag` functions support passing React.RefObject.
  // https://github.com/react-dnd/react-dnd/blob/main/packages/react-dnd/src/common/TargetConnector.ts#L13
  // https://github.com/react-dnd/react-dnd/blob/main/packages/react-dnd/src/common/SourceConnector.ts#L23
  drag(handleRef ?? itemRef);
  drop(itemRef);

  return {
    // We don't use react-dnd's `monitor.isDragging()` because of the small
    // delay it has to update.
    // Our `draggedIndex` and `monitor.isDragging()` would be out of sync and
    // can create glitches during the rendering.
    isDragging: draggedIndex === index,

    disabled,
    pendingDropIndex,
  };
}

function subtractCoordinates(a: XYCoord, b: XYCoord): XYCoord {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

function getPointerDistanceFromSource(monitor: DragLayerMonitor): XYCoord {
  const initialPointerCoordinates = monitor.getInitialClientOffset();

  // The top left corner of the source (dragged) element.
  const initialSourceCoordinates = monitor.getInitialSourceClientOffset();

  if (initialPointerCoordinates == null || initialSourceCoordinates == null) {
    return { x: 0, y: 0 };
  }

  // The corner of the source element has always smaller coordinates than the
  // pointer, so the difference is always positive.
  return subtractCoordinates(
    initialPointerCoordinates,
    initialSourceCoordinates
  );
}

function getSourcePreviewCoordinates(
  monitor: DragLayerMonitor
): XYCoord | null {
  const currentPointerCoordinates = monitor.getClientOffset();
  if (currentPointerCoordinates == null) {
    return null;
  }

  return subtractCoordinates(
    currentPointerCoordinates,
    getPointerDistanceFromSource(monitor)
  );
}

function getStyle(
  draggedElementInitialRect: DOMRect,
  sourcePreviewCoordinates: XYCoord
): React.CSSProperties {
  const transform = `translate(${sourcePreviewCoordinates.x}px, ${sourcePreviewCoordinates.y}px)`;

  return {
    pointerEvents: "none",
    position: "fixed",
    top: 0,
    left: 0,
    transform,
    WebkitTransform: transform,
    width: draggedElementInitialRect.width,
    height: draggedElementInitialRect.height,
  };
}

type UseDragPreviewReturn<DataType> =
  | {
      display: false;
    }
  | {
      display: true;
      item: DragItem<DataType>;
      style: React.CSSProperties;
    };

// Insipred from react-dnd-preview
// https://github.com/LouisBrunner/dnd-multi-backend/tree/main/packages/react-dnd-preview
export function useDragPreview<DataType>(): UseDragPreviewReturn<DataType> {
  const { draggedElementInitialRect } = useDragAndDropContext("useDragPreview");

  const { item, isDragging, sourcePreviewCoordinates } = useDragLayer(
    (monitor: DragLayerMonitor) => ({
      sourcePreviewCoordinates: getSourcePreviewCoordinates(monitor),
      isDragging: monitor.isDragging(),
      item: monitor.getItem() as DragItem<DataType>,
    })
  );

  if (
    !isDragging ||
    sourcePreviewCoordinates == null ||
    draggedElementInitialRect == null
  ) {
    return { display: false };
  }

  return {
    display: true,
    item: item,
    style: getStyle(draggedElementInitialRect, sourcePreviewCoordinates),
  };
}
