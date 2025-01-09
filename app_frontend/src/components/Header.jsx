import React, { useEffect, useRef, useState } from "react";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const suggestionsRef = useRef(null);
  const userMenuRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/snkrs/search?query=${searchTerm}`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);

      // Si hay un único resultado, redirigir automáticamente
      if (data.length === 1) {
        window.location.href = `/sneaker/${data[0].id}`;
      } else if (data.length > 0) {
        // Si hay más de un resultado, redirigir al primer resultado
        window.location.href = `/sneaker/${data[0].id}`;
      } else {
        alert("No se encontraron zapatillas para tu búsqueda.");
      }
    } catch (error) {
      console.error("Error al buscar zapatillas:", error);
    }
  };

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length > 1) {
      try {
        const response = await fetch(`http://localhost:3000/api/snkrs/search?query=${query}`);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setSearchResults(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error al buscar zapatillas:", error);
      }
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-primary text-white py-4 px-6 flex items-center justify-between relative">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => {
          const token = localStorage.getItem("token");
          if (token) {
            window.location.href = "/home";
          } else {
            window.location.href = "/";
          }
        }}
      >
        SNKRS ROYAL
      </h1>

      <div className="flex-1 flex justify-center">
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Busca tus zapatillas favoritas..."
            className="w-full px-4 py-2 rounded-full bg-light text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-accent"
          >
            🔍
          </button>
          {showSuggestions && searchResults.slice(0, 5).length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute mt-2 bg-white w-full max-w-md rounded-lg shadow-lg z-10"
            >
              {searchResults.slice(0, 5).map((snkr) => (
                <div
                  key={snkr.id}
                  className="p-2 flex items-center hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(snkr.name);
                    setShowSuggestions(false);
                    window.location.href = `/sneaker/${snkr.id}`; // Redirige a los detalles de la zapatilla
                  }}
                >
                  <img
                    src={snkr.image_url}
                    alt={snkr.name}
                    className="w-10 h-10 rounded mr-4"
                  />
                  <div>
                    <p className="font-semibold text-black">{snkr.name}</p>
                    <p className="text-sm text-gray-500">{snkr.colorway}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

      <div className="flex items-center space-x-4">
        <button
          className="bg-secondary px-4 py-2 rounded text-white font-semibold hover:bg-muted"
          onClick={() => (window.location.href = "/sell")}
        >
          Sell
        </button>
        <button
          className="bg-secondary px-4 py-2 rounded text-white font-semibold hover:bg-muted"
          onClick={() => (window.location.href = "/new-exchange")}
        >
          Exchange
        </button>
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="bg-secondary px-3 py-2 rounded flex items-center space-x-2 text-white font-semibold hover:bg-muted"
          >
            <span>Usuario</span>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
              alt="User Icon"
              className="w-5 h-5 filter invert"
            />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-20">
              <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Perfil
              </a>
              <a href="/exchanges" className="block px-4 py-2 hover:bg-gray-100">
                Mis Exchanges
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="block px-4 py-2 text-left w-full hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
