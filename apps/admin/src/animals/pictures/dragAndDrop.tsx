import { DataUrlOrDynamicImage, ImageFileOrId } from "~/core/dataDisplay/image";
import { createDragAndDropContext } from "~/core/dragAndDrop";

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
      sizes={{ default: "300px" }}
      fallbackSize="512"
      loading="eager"
      className="overflow-hidden shadow-ambient rounded-1"
      style={preview.style}
    />
  );
}
