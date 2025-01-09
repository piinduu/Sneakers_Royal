import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SellDetails() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSneaker, setSelectedSneaker] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/api/snkrs/search?query=${searchTerm}`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
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
            } catch (error) {
                console.error("Error al buscar zapatillas:", error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectSneaker = (sneaker) => {
        setSelectedSneaker(sneaker);
        setSearchResults([]);
        setSearchTerm("");
    };

    const handleConfirm = () => {
        if (selectedSneaker) {
            navigate("/sell/set-price", { state: { sneaker: selectedSneaker } }); // Redirige a la ruta correcta
        } else {
            alert("Por favor, selecciona una zapatilla antes de confirmar.");
        }
    };

    return (
        <div className="max-w-screen-lg mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Poner anuncio</h1>
            <p className="text-lg text-center mb-8">¿Qué artículo quieres vender?</p>

            {/* Barra de búsqueda */}
            <form onSubmit={handleSearch} className="relative max-w-md mx-auto mb-6">
                <input
                    type="text"
                    placeholder="Busca tus zapatillas favoritas..."
                    className="w-full px-4 py-2 rounded-full bg-gray-100 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500"
                >
                    🔍
                </button>
                {searchResults.length > 0 && (
                    <div className="absolute mt-2 bg-white w-full max-w-md rounded-lg shadow-lg z-10">
                        {searchResults.slice(0, 5).map((sneaker) => (
                            <div
                                key={sneaker.id}
                                className="p-2 flex items-center hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelectSneaker(sneaker)}
                            >
                                <img
                                    src={sneaker.image_url}
                                    alt={sneaker.name}
                                    className="w-10 h-10 rounded mr-4"
                                />
                                <div>
                                    <p className="font-semibold text-black">{sneaker.name}</p>
                                    <p className="text-sm text-gray-500">{sneaker.style_id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </form>

            {/* Zapatilla seleccionada */}
            {selectedSneaker && (
                <div className="border p-4 rounded shadow flex items-center space-x-4 max-w-md mx-auto mb-6">
                    <img
                        src={selectedSneaker.image_url}
                        alt={selectedSneaker.name}
                        className="w-20 h-20 object-contain"
                    />
                    <div>
                        <p className="text-lg font-bold">{selectedSneaker.name}</p>
                        <p className="text-sm text-gray-500">{selectedSneaker.style_id}</p>
                    </div>
                </div>
            )}

            {/* Botón de confirmar */}
            {selectedSneaker && (
                <div className="text-center">
                    <button
                        className="bg-blue-500 text-white py-3 px-6 rounded text-lg hover:bg-blue-600"
                        onClick={handleConfirm}
                    >
                        Confirmar
                    </button>
                </div>
            )}
        </div>
    );
}

export default SellDetails;
