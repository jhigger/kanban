import { type UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import React from "react";
import { cn } from "~/lib/utils";
import { type DNDType } from "~/pages";
import AddItemModal from "./AddItemModal";
import { Button } from "./ui/button";

type ContainerProps = {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
  description?: string;
  containers: DNDType[];
  setContainers: (value: DNDType[]) => void;
};

const Container = ({
  id,
  children,
  title,
  description,
  containers,
  setContainers,
}: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "container",
    },
    attributes: {
      role: "group",
    },
  });

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={cn(
        "flex h-max w-full flex-col gap-y-4 rounded-xl bg-gray-50 p-4",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h2 className="text-xl font-medium text-gray-800">{title}</h2>
          <p className="text-base text-gray-400">{description}</p>
        </div>
        <Button size="icon" variant="ghost" {...listeners}>
          <GripVertical />
        </Button>
      </div>
      {children}
      <AddItemModal
        containers={containers}
        setContainers={setContainers}
        currentContainerId={id}
      />
    </div>
  );
};

export default Container;
