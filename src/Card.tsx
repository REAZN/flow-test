import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

export type CardType = {
  record_id: string;
  first_name: string;
};

const Card = ({
  record_id,
  first_name,
}: {
  record_id: string;
  first_name: string;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: record_id,
  });

  const style = {
    margin: "10px",
    opacity: 1,
    color: "#333",
    background: "white",
    padding: "10px",
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <div>
        <p>{first_name}</p>
      </div>
    </div>
  );
};

export default Card;
