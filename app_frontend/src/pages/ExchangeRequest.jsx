import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ExchangeRequest() {
    const location = useLocation();
    const navigate = useNavigate();
    const { exchangeData } = location.state || {}; // Datos del intercambio creado previamente

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSneakers, setSelectedSneakers] = useState([]);

    useEffect(() => {
        if (!exchangeData) {
            alert("No se encontraron datos del intercambio. Redirigiendo...");
            navigate("/new-exchange");
        }
    }, [exchangeData, navigate]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchTerm.length > 1) {
                try {
                    const response = await fetch(`http://localhost:3000/api/snkrs/search?query=${searchTerm}`);
                    if (!response.ok) {
                        throw new Error("Error al buscar zapatillas");
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

        fetchSearchResults();
    }, [searchTerm]);

    const handleSelectSneaker = (sneaker) => {
        if (selectedSneakers.length >= 3) {
            alert("Solo puedes seleccionar un máximo de 3 zapatillas.");
            return;
        }
        if (selectedSneakers.some((s) => s.id === sneaker.id)) {
            alert("Ya has seleccionado esta zapatilla.");
            return;
        }
        setSelectedSneakers([...selectedSneakers, { ...sneaker, size: "", condition: "" }]); // Añadir talla y estado vacíos inicialmente
        setSearchResults([]);
        setSearchTerm("");
    };

    const handleSizeChange = (id, size) => {
        setSelectedSneakers((prevSneakers) =>
            prevSneakers.map((s) => (s.id === id ? { ...s, size } : s))
        );
    };

    const handleConditionChange = (id, condition) => {
        setSelectedSneakers((prevSneakers) =>
            prevSneakers.map((s) => (s.id === id ? { ...s, condition } : s))
        );
    };

    const handleRemoveSneaker = (sneakerId) => {
        setSelectedSneakers(selectedSneakers.filter((s) => s.id !== sneakerId));
    };

    const handleConfirm = async () => {
        if (selectedSneakers.some((s) => !s.size || !s.condition)) {
            alert("Por favor, selecciona talla y estado para todas las zapatillas.");
            return;
        }

        try {
            const token = localStorage.getItem("token"); // Obtener el token almacenado

            const response = await fetch(`http://localhost:3000/api/exchanges/${exchangeData.id}/accepted-sneakers`, {
                method: "PUT", // Cambiado a PUT
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Enviar el token
                },
                body: JSON.stringify({
                    acceptedSneakers: selectedSneakers.map((s) => ({
                        snkr_id: s.id,
                        size: s.size,
                        condition: s.condition,
                    })),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error del backend:", errorData);
                throw new Error("Error al actualizar las solicitudes de intercambio.");
            }

            alert("¡Intercambio completado!");
            navigate("/home"); // Redirigir al Home
        } catch (error) {
            console.error("Error al actualizar solicitudes de intercambio:", error);
            alert("Hubo un problema al completar el intercambio.");
        }
    };

    return (
        <div className="max-w-screen-lg mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Selecciona tu intercambio</h1>

            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Busca zapatillas para intercambiar"
                    className="w-full px-4 py-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchResults.length > 0 && (
                    <div className="absolute z-10 bg-white border rounded shadow mt-2 w-full">
                        {searchResults.slice(0, 5).map((sneaker) => ( // Limitar a 5 resultados
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
            </div>

            {selectedSneakers.length > 0 && (
                <div className="p-4 border rounded shadow mb-6">
                    <p className="text-lg font-semibold">Has seleccionado:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {selectedSneakers.map((sneaker) => (
                            <div
                                key={sneaker.id}
                                className="border rounded shadow flex flex-col items-center p-2 relative"
                            >
                                <img
                                    src={sneaker.image_url}
                                    alt={sneaker.name}
                                    className="w-16 h-16 rounded mb-2"
                                />
                                <div className="text-center">
                                    <p className="font-semibold">{sneaker.name}</p>
                                    <p className="text-sm text-gray-500">{sneaker.style_id}</p>
                                </div>
                                <div className="mt-2">
                                    <select
                                        className="w-full px-2 py-1 rounded border"
                                        value={sneaker.size}
                                        onChange={(e) => handleSizeChange(sneaker.id, e.target.value)}
                                    >
                                        <option value="">Selecciona talla</option>
                                        {[...Array(16)].map((_, i) => (
                                            <option key={i} value={35 + i}>
                                                {35 + i}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-2">
                                    <select
                                        className="w-full px-2 py-1 rounded border"
                                        value={sneaker.condition}
                                        onChange={(e) =>
                                            handleConditionChange(sneaker.id, e.target.value)
                                        }
                                    >
                                        <option value="">Selecciona estado</option>
                                        <option value="nuevo">Nuevo</option>
                                        <option value="nuevo-con-defectos">Nuevo con defectos</option>
                                        <option value="usado">Usado</option>
                                    </select>
                                </div>
                                <button
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    onClick={() => handleRemoveSneaker(sneaker.id)}
                                >
                                    ✖
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="text-center mt-6">
                <button
                    className="bg-accent text-white py-2 px-4 rounded hover:bg-muted"
                    onClick={handleConfirm}
                >
                    Confirmar Intercambio
                </button>
            </div>
        </div>
    );
}

export default ExchangeRequest;