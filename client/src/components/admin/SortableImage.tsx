import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import Image from "next/image";

function SortableImage({
  id,
  preview,
  onRemove,
}: {
  id: string;
  preview: string;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative inline-block">
      <Image
        src={preview}
        alt="preview"
        width={80}
        height={80}
        className="w-20 h-20 object-cover rounded-md"
      />

      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-white text-rose-700 text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md z-20"
      >
        <Trash2 size={12} />
      </button>
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-1 left-1 p-1 cursor-grab bg-white/80 rounded"
      >
        <GripVertical size={14} />
      </div>
    </div>
  );
}

export default SortableImage;
