import type { ImageFileOrId } from "#core/data-display/image";
import { DataUrlOrDynamicImage } from "#core/data-display/image";
import { createDragAndDropContext } from "#core/drag-and-drop";

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
      className="overflow-hidden rounded-1 shadow-ambient"
      style={preview.style}
    />
  );
}
