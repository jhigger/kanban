import { type UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

type ItemProps = {
  id: UniqueIdentifier;
  title: string;
};

const Item = ({ id, title }: ItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "item",
    },
  });

  return (
    <div
      ref={setNodeRef}  
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={cn(
        "w-full cursor-pointer rounded-xl border border-transparent bg-white px-2 py-4 shadow-md hover:border-gray-200",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex items-center justify-between">
        {title}
        <Button size="icon" variant="ghost" {...listeners}>
          <GripVertical />
        </Button>
      </div>
    </div>
  );
};

export default Item;
