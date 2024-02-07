import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column, { ColumnType } from "./Column";
import { useState } from "react";

export default function App() {
  const data = [
    {
      id: "1",
      description: "1",
      cards: {
        meta: {},
        data: [],
      },
    },
    {
      id: "2",
      description: "2",
      cards: {
        meta: {},
        data: [
          {
            record_id: "1H", // Changing this to "1" breaks and it thinks its undefined
            first_name: "Christopher",
          },
        ],
      },
    },
    {
      id: "3",
      description: "3",
      cards: {
        meta: {},
        data: [
          {
            record_id: "2H",
            first_name: "Lewis",
          },
        ],
      },
    },
    {
      id: "4",
      description: "4",
      cards: {
        meta: {},
        data: [],
      },
    },
  ];

  const [columns, setColumns] = useState<ColumnType[]>(data);

  const findColumn = (unique: string | null) => {
    if (!unique) {
      return null;
    }
    if (columns.some((c) => c.id === unique)) {
      return columns.find((c) => c.id === unique) ?? null;
    }
    const id = unique;
    const itemWithColumnId = columns.flatMap((c) => {
      const columnId = c.id;
      return c.cards.data.map((i) => ({
        id: i.record_id,
        columnId: columnId,
      }));
    });
    const columnId = itemWithColumnId.find((i) => i.id === id)?.columnId;
    return columns.find((c) => c.id === columnId) ?? null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over, delta } = event;
    const activeId = active.id;
    const overId = over ? over.id : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return;
    }
    console.log(event, "before");
    setColumns((prevState) => {
      const updatedColumns = prevState.map((column) => {
        if (column.id === activeColumn.id) {
          const updatedActiveCards = column.cards.data.filter(
            (card) => card.record_id !== activeId
          );
          return {
            ...column,
            cards: { ...column.cards, data: updatedActiveCards },
          };
        }
        if (column.id === overColumn.id) {
          const overIndex = overColumn.cards.data.findIndex(
            (card) => card.record_id === overId
          );
          const newIndex = overIndex + (delta.y > 0 ? 1 : 0);

          const updatedOverCards = [...overColumn.cards.data];
          updatedOverCards.splice(
            newIndex,
            0,
            activeColumn.cards.data.find((card) => card.record_id === activeId)
          );

          return {
            ...column,
            cards: { ...column.cards, data: updatedOverCards },
          };
        }
        return column;
      });
      return updatedColumns;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over ? over.id : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return null;
    }
    const activeIndex = activeColumn.cards.data.findIndex(
      (i) => i.record_id === activeId
    );
    const overIndex = overColumn.cards.data.findIndex(
      (i) => i.record_id === overId
    );
    if (activeIndex !== overIndex) {
      setColumns((prevState) => {
        return prevState.map((column) => {
          if (column.id === activeColumn.id) {
            column.cards.data = arrayMove(
              overColumn.cards.data,
              activeIndex,
              overIndex
            );
            return column;
          } else {
            return column;
          }
        });
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <pre>{JSON.stringify(columns, null, 2)}</pre>

      <div
        className="App"
        style={{ display: "flex", flexDirection: "row", padding: "20px" }}
      >
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            description={column.description}
            cards={column.cards}
          ></Column>
        ))}
      </div>
    </DndContext>
  );
}
