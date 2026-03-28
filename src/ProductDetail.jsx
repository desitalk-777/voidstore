import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="page center">
      <h2>Product ID: {id}</h2>
      <p>Details coming soon...</p>
    </div>
  );
}