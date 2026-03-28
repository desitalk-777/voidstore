import { Link } from "react-router-dom";

export default function Categories() {
  return (
    <div className="page center">
      <h2>Select Category</h2>

      <div className="categories">
        <Link to="/products/gaming">
          <button>🎮 Gaming Accounts</button>
        </Link>

        <Link to="/products/ott">
          <button>📺 OTT Accounts</button>
        </Link>
      </div>
    </div>
  );
}