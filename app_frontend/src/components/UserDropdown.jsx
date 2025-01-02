import { useState } from "react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white px-4 py-2 rounded-md"
      >
        Usuario
      </button>
      {isOpen && (
        <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
          <li>
            <a
              href="/profile"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Editar Perfil
            </a>
          </li>
          <li>
            <a
              href="/my-exchanges"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Mis Exchanges
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}
