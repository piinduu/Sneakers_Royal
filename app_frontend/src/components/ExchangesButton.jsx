import { Link } from "react-router-dom";

export default function ExchangesButton() {
  return (
    <Link to="/exchanges">
      <button className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-light">
        Ver Exchanges
      </button>
    </Link>
  );
}
