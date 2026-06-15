import { useParams } from "react-router-dom";

export default function Depo() {
  const { id } = useParams();

  return (
    <div>
      <h1>Depo {id}</h1>
    </div>
  );
}