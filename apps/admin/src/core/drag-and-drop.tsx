import { generateId } from "#core/id";
import { useIsTouchScreen } from "#core/touch-screen";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DragLayerMonitor, XYCoord } from "react-dnd";
import { DndProvider, useDrag, useDragLayer, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import invariant from "tiny-invariant";

export enum DragAndDropDirection {
  HORIZONTAL,
  VERTICAL,
}

type ProviderState = {
  pendingDropIndex: null | number;
  draggedIndex: null | number;
  draggedElementInitialRect: null | DOMRect;
};

const INITIAL_STATE: ProviderState = {
  draggedElementInitialRect: null,
  pendingDropIndex: null,
  draggedIndex: null,
};

export function createDragAndDropContext<DataType>() {
  const Context = createContext<null | DragAndDropContextValue>(null);

  function useDragAndDropContext(functionCallerName: string) {
    const context = useContext(Context);

    invariant(
      context != null,
      `${functionCallerName} can only be used inside a DragAndDropContextProvider.`,
    );

    return context;
  }

  function DragAndDropContextProvider({
    children,
    direction = DragAndDropDirection.HORIZONTAL,
    isDisabled = false,
    previewElement: PreviewElement,
  }: {
    children?: React.ReactNode;
    direction?: DragAndDropDirection;
    isDisabled?: boolean;
    previewElement: React.ElementType;
  }) {
    const [state, setState] = useState(INITIAL_STATE);

    const startDrag = useCallback<DragAndDropContextValue["startDrag"]>(
      (draggedIndex, draggedElementInitialRect) => {
        // If we don't dispatch on next tick the drag ends immediately.
        // Maybe due to fast DOM change during the native event?
        setTimeout(() => {
          setState({
            draggedElementInitialRect,
            draggedIndex,
            pendingDropIndex: draggedIndex,
          });
        });
      },
      [],
    );

    const endDrag = useCallback<DragAndDropContextValue["endDrag"]>(() => {
      setState(INITIAL_STATE);
    }, []);

    const hoverItem = useCallback<DragAndDropContextValue["hoverItem"]>(
      (pendingDropIndex) => {
        setState((state) => {
          if (state.pendingDropIndex === pendingDropIndex) {
            // Preserve the current reference.
            return state;
          }

          return { ...state, pendingDropIndex };
        });
      },
      [],
    );

    const itemType = useMemo(generateId, []);

    const value = useMemo<DragAndDropContextValue>(
      () => ({
        ...state,
        direction,
        isDisabled: isDisabled,
        endDrag,
        hoverItem,
        itemType,
        startDrag,
      }),
      [direction, endDrag, hoverItem, isDisabled, itemType, startDrag, state],
    );

    const { isTouchScreen } = useIsTouchScreen();
    const backend = isTouchScreen ? TouchBackend : HTML5Backend;

    return (
      <DndProvider backend={backend}>
        <Context.Provider value={value}>
          {children}

          {
            // Only use custom preview for touch screens.
            isTouchScreen ? <PreviewElement /> : null
          }
        </Context.Provider>
      </DndProvider>
    );
  }

  function useDropContainer({
    containerRef,
    setItems,
  }: UseDropContainerParameters<DataType>) {
    const { isDisabled, hoverItem, itemType, pendingDropIndex } =
      useDragAndDropContext("useDropContainer");

    const [{ isOver }, drop] = useDrop<
      DragItem<DataType>,
      void,
      { isOver: boolean }
    >({
      accept: itemType,
      canDrop: () => !isDisabled && pendingDropIndex != null,
      collect: (monitor) => ({ isOver: monitor.isOver() }),
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
            invariant(item != null, "The dragged item should exists");

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

    // The `drop` function support passing RefObject.
    // https://github.com/react-dnd/react-dnd/blob/master/packages/core/react-dnd/src/common/TargetConnector.ts#L13
    drop(containerRef);

    useEffect(() => {
      if (!isOver) {
        hoverItem(null);
      }
    }, [isOver, hoverItem]);

    return { pendingDropIndex };
  }

  function useDragItem({
    data,
    handleRef,
    index,
    itemRef,
    previewRef,
  }: UseDragItemParameters<DataType>) {
    const {
      direction,
      isDisabled,
      draggedIndex,
      endDrag,
      hoverItem,
      itemType,
      pendingDropIndex,
      startDrag,
    } = useDragAndDropContext("useDragItem");

    const [, drag, preview] = useDrag<DragItem<DataType>, void, void>({
      canDrag: () => !isDisabled,

      // Reset the drag and drop when either a drop was done or not.
      end: () => endDrag(),

      item: () => {
        invariant(itemRef.current != null, "itemRef should be defined");
        startDrag(index, itemRef.current.getBoundingClientRect());
        return { data, index };
      },

      type: itemType,
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
        if (!isDisabled && itemRef.current != null && pointerPosition != null) {
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

    // The `drop` and `drag` functions support passing RefObject.
    // https://github.com/react-dnd/react-dnd/blob/main/packages/react-dnd/src/common/TargetConnector.ts#L13
    // https://github.com/react-dnd/react-dnd/blob/main/packages/react-dnd/src/common/SourceConnector.ts#L23
    drag(handleRef ?? itemRef);
    preview(previewRef ?? itemRef);
    drop(itemRef);

    return {
      isDisabled,

      // We don't use react-dnd's `monitor.isDragging()` because of the small
      // delay it has to update.
      // Our `draggedIndex` and `monitor.isDragging()` would be out of sync and
      // can create glitches during the rendering.
      isDragging: draggedIndex === index,

      pendingDropIndex,
    };
  }

  // Insipred from react-dnd-preview
  // https://github.com/LouisBrunner/dnd-multi-backend/tree/main/packages/react-dnd-preview
  function useDragPreview(): UseDragPreviewReturn<DataType> {
    const { draggedElementInitialRect } =
      useDragAndDropContext("useDragPreview");

    const { isDragging, item, sourcePreviewCoordinates } = useDragLayer(
      (monitor: DragLayerMonitor) => ({
        isDragging: monitor.isDragging(),
        item: monitor.getItem() as DragItem<DataType>,
        sourcePreviewCoordinates: getSourcePreviewCoordinates(monitor),
      }),
    );

    if (
      !isDragging ||
      sourcePreviewCoordinates == null ||
      draggedElementInitialRect == null
    ) {
      return { isVisible: false };
    }

    return {
      isVisible: true,
      item: item,
      style: getStyle(draggedElementInitialRect, sourcePreviewCoordinates),
    };
  }

  return {
    DragAndDropContextProvider,
    useDragItem,
    useDragPreview,
    useDropContainer,
  };
}

type DragAndDropContextValue = ProviderState & {
  direction: DragAndDropDirection;
  endDrag: () => void;
  hoverItem: (index: number | null) => void;
  isDisabled: boolean;
  itemType: string;
  startDrag: (index: number, draggedElementInitialRect: DOMRect) => void;
};

type DragItem<DataType> = {
  data: DataType;
  index: number;
};

type UseDropContainerParameters<DataType> = {
  containerRef: React.RefObject<HTMLElement>;
  setItems: React.Dispatch<(prevState: DataType[]) => DataType[]>;
};

type UseDragItemParameters<DataType> = {
  data: DataType;
  handleRef?: React.RefObject<HTMLElement>;
  index: number;
  itemRef: React.RefObject<HTMLElement>;
  previewRef?: React.RefObject<HTMLElement>;
};

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
    initialSourceCoordinates,
  );
}

function getSourcePreviewCoordinates(
  monitor: DragLayerMonitor,
): XYCoord | null {
  const currentPointerCoordinates = monitor.getClientOffset();
  if (currentPointerCoordinates == null) {
    return null;
  }

  return subtractCoordinates(
    currentPointerCoordinates,
    getPointerDistanceFromSource(monitor),
  );
}

function getStyle(
  draggedElementInitialRect: DOMRect,
  sourcePreviewCoordinates: XYCoord,
): React.CSSProperties {
  const transform = `translate(${sourcePreviewCoordinates.x}px, ${sourcePreviewCoordinates.y}px)`;

  return {
    position: "fixed",
    top: 0,
    left: 0,
    transform,
    WebkitTransform: transform,
    width: draggedElementInitialRect.width,
    height: draggedElementInitialRect.height,
    pointerEvents: "none",
  };
}

type UseDragPreviewReturn<DataType> =
  | {
      isVisible: false;
    }
  | {
      item: DragItem<DataType>;
      style: React.CSSProperties;
      isVisible: true;
    };
