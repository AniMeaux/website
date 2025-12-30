import type { ImageFileOrId } from "#i/core/data-display/image";
import { DataUrlOrDynamicImage } from "#i/core/data-display/image";
import { createDragAndDropContext } from "#i/core/drag-and-drop";

const {
  DragAndDropContextProvider,
  useDragItem,
  useDragPreview,
  useDropContainer,
} = createDragAndDropContext<ImageFileOrId>();

export {
  DragAndDropContextProvider,
  useDragItem,
  useDragPreview,
  useDropContainer,
};

export function PictureItemPreview() {
  const preview = useDragPreview();

  if (!preview.isVisible) {
    return null;
  }

  return (
    <DataUrlOrDynamicImage
      alt="Dragged image"
      image={preview.item.data}
      sizeMapping={{ default: "300px" }}
      fallbackSize="512"
      loading="eager"
      className="overflow-hidden rounded-1 shadow-popover-sm"
      style={preview.style}
    />
  );
}
