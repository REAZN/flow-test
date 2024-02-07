import { FC } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card, { CardType } from "./Card";

export type ColumnType = {
  id: string;
  description: string;
  cards: {
    meta: unknown;
    data: CardType[];
  };
};

const Column: FC<ColumnType> = ({ id, description, cards }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <SortableContext
      id={id}
      items={cards.data.map((card) => ({ id: card.record_id }))}
      strategy={rectSortingStrategy}
    >
      <div
        ref={setNodeRef}
        style={{
          width: "200px",
          background: "rgba(245,247,249,1.00)",
          marginRight: "10px",
        }}
      >
        <p
          style={{
            padding: "5px 20px",
            textAlign: "left",
            fontWeight: "500",
            color: "#575757",
          }}
        >
          {description}
        </p>
        {cards.data.map((card) => (
          <Card
            key={card.record_id}
            record_id={card.record_id}
            first_name={card.first_name}
          ></Card>
        ))}
      </div>
    </SortableContext>
  );
};

export default Column;
