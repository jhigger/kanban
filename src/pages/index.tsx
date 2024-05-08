import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import Head from "next/head";
import { useState } from "react";
import AddContainerModal from "~/components/AddContainerModal";
import Container from "~/components/Container";
import Item from "~/components/Item";

export type DNDType = {
  id: UniqueIdentifier;
  title: string;
  description: string;
  items: {
    id: UniqueIdentifier;
    title: string;
  }[];
};

export default function Home() {
  const [containers, setContainers] = useState<DNDType[]>([
    {
      id: "container1",
      title: "To Do",
      description: "Things that need to be done",
      items: [
        {
          id: "item1",
          title: "Item 1",
        },
        {
          id: "item2",
          title: "Item 2",
        },
      ],
    },
    {
      id: "container2",
      title: "Done",
      description: "Things that are done",
      items: [
        {
          id: "item3",
          title: "Item 3",
        },
        {
          id: "item4",
          title: "Item 4",
        },
      ],
    },
  ]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Find the value of the items
  const findValueOfItems = (id: UniqueIdentifier | undefined, type: string) => {
    if (type === "container") {
      return containers.find((item) => item.id === id);
    }

    if (type === "item") {
      return containers.find((container) =>
        container.items.find((item) => item.id === id),
      );
    }
  };

  const findItemTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container) return "";
    const item = container.items.find((item) => item.id === id);
    if (!item) return "";
    return item.title;
  };

  const findContainerTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return "";
    return container.title;
  };

  const findContainerDescription = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return "";
    return container.description;
  };

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return [];
    return container.items;
  };

  // dnd handlers

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    // handle item sorting
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // find the active container and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // if the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // find the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );

      // find the index of the active and over item
      const activeItemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );
      const overItemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      );

      // in the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers];
        newItems[activeContainerIndex]!.items = arrayMove(
          newItems[activeContainerIndex]!.items,
          activeItemIndex,
          overItemIndex,
        );

        setContainers(newItems);
      } else {
        // in different containers
        const newItems = [...containers];
        const [removedItem] = newItems[activeContainerIndex]!.items.splice(
          activeItemIndex,
          1,
        );
        newItems[overContainerIndex]!.items.splice(
          overItemIndex,
          0,
          removedItem!,
        );
        setContainers(newItems);
      }

      // Handling Item Drop Into a Container
      if (
        active.id.toString().includes("item") &&
        over?.id.toString().includes("container") &&
        active &&
        over &&
        active.id !== over.id
      ) {
        // Find the active and over container
        const activeContainer = findValueOfItems(active.id, "item");
        const overContainer = findValueOfItems(over.id, "container");

        // If the active or over container is not found, return
        if (!activeContainer || !overContainer) return;

        // Find the index of the active and over container
        const activeContainerIndex = containers.findIndex(
          (container) => container.id === activeContainer.id,
        );
        const overContainerIndex = containers.findIndex(
          (container) => container.id === overContainer.id,
        );

        // Find the index of the active and over item
        const activeitemIndex = activeContainer.items.findIndex(
          (item) => item.id === active.id,
        );

        // Remove the active item from the active container and add it to the over container
        const newItems = [...containers];
        const [removedItem] = newItems[activeContainerIndex]!.items.splice(
          activeitemIndex,
          1,
        );
        newItems[overContainerIndex]!.items.push(removedItem!);
        setContainers(newItems);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active.id.toString().includes("container") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === active.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === over.id,
      );
      // Swap the active and over container
      let newItems = [...containers];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setContainers(newItems);
    }

    // Handling item Sorting
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );
      // Find the index of the active and over item
      const activeItemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );
      const overItemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      );

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers];
        newItems[activeContainerIndex]!.items = arrayMove(
          newItems[activeContainerIndex]!.items,
          activeItemIndex,
          overItemIndex,
        );
        setContainers(newItems);
      } else {
        // In different containers
        const newItems = [...containers];
        const [removedItem] = newItems[activeContainerIndex]!.items.splice(
          activeItemIndex,
          1,
        );
        newItems[overContainerIndex]!.items.splice(
          overItemIndex,
          0,
          removedItem!,
        );
        setContainers(newItems);
      }
    }
    // Handling item dropping into Container
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );

      const newItems = [...containers];
      const [removedItem] = newItems[activeContainerIndex]!.items.splice(
        activeitemIndex,
        1,
      );
      newItems[overContainerIndex]!.items.push(removedItem!);
      setContainers(newItems);
    }
    setActiveId(null);
  };

  return (
    <>
      <Head>
        <title>Kanban</title>
        <meta name="description" content="Kanban board using dnd-kit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen">
        <div className="container mx-auto flex items-center justify-between gap-12 px-4 py-16">
          <h1 className="text-4xl font-bold">Kanban</h1>
          <AddContainerModal
            containers={containers}
            setContainers={setContainers}
          />
        </div>
        <div className="container mx-auto grid grid-cols-3 gap-12 px-4 py-16">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={containers.map((container) => container.id)}
            >
              {containers.map((container) => (
                <Container
                  id={container.id}
                  key={container.id}
                  title={container.title}
                  description={container.description}
                  containers={containers}
                  setContainers={setContainers}
                >
                  <SortableContext
                    items={container.items.map((item) => item.id)}
                  >
                    <div className="flex flex-col gap-4">
                      {container.items.map((item) => (
                        <Item key={item.id} id={item.id} title={item.title} />
                      ))}
                    </div>
                  </SortableContext>
                </Container>
              ))}
            </SortableContext>
            <DragOverlay adjustScale={false}>
              {/* Drag Overlay For item Item */}
              {activeId && activeId.toString().includes("item") && (
                <Item id={activeId} title={findItemTitle(activeId)} />
              )}
              {/* Drag Overlay For Container */}
              {activeId && activeId.toString().includes("container") && (
                <Container
                  id={activeId}
                  title={findContainerTitle(activeId)}
                  description={findContainerDescription(activeId)}
                  containers={containers}
                  setContainers={setContainers}
                >
                  <div className="flex flex-col gap-4">
                    {findContainerItems(activeId).map((i) => (
                      <Item key={i.id} title={i.title} id={i.id} />
                    ))}
                  </div>
                </Container>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </main>
    </>
  );
}
