import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AllExchangesDetails() {
    const { id } = useParams(); // ID recibido de los parámetros de la URL
    const [exchange, setExchange] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Obtener detalles del intercambio
    useEffect(() => {
        const fetchExchangeDetails = async () => {
            try {
                console.log(`Fetching exchange details for ID: ${id}`);
                const response = await fetch(`http://localhost:3000/api/exchanges/${id}`);
                if (!response.ok) {
                    throw new Error("Error al obtener los detalles del intercambio");
                }
                const data = await response.json();
                console.log("Datos recibidos del backend:", data);

                // Ajustar según la estructura recibida
                setExchange(data.exchange || data);
                console.log("Estado de 'exchange' actualizado:", data.exchange || data);
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener detalles del intercambio:", err);
                setError("No se pudieron cargar los detalles del intercambio.");
                setLoading(false);
            }
        };

        fetchExchangeDetails();
    }, [id]);

    // Manejar aceptación del intercambio
    const handleAcceptExchange = async (exchangeId) => {
        console.log("ID recibido en handleAcceptExchange:", exchangeId);
        if (!exchangeId) {
            console.error("El ID del intercambio no está definido. Estado actual de 'exchange':", exchange);
            alert("Error: El ID del intercambio no es válido.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("No estás autenticado. Por favor, inicia sesión.");
                window.location.href = "/";
                return;
            }

            const response = await fetch(`http://localhost:3000/api/exchanges/${exchangeId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "accepted" }),
            });

            if (!response.ok) {
                throw new Error("Error al aceptar el intercambio.");
            }

            const result = await response.json();
            console.log("Respuesta del backend al aceptar intercambio:", result);
            alert("Intercambio aceptado con éxito.");
            navigate("/home");
        } catch (error) {
            console.error("Error al aceptar el intercambio:", error);
            alert("Hubo un problema al aceptar el intercambio.");
        }
    };

    // Renderizado del componente
    if (loading) return <p className="text-center mt-8">Cargando detalles...</p>;
    if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

    console.log("Estructura detallada de 'exchange':", JSON.stringify(exchange, null, 2)); // Depuración

    return (
        <div className="p-6 max-w-5xl mx-auto bg-gray-50 rounded shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Detalles del Intercambio
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Producto Ofrecido */}
                <div className="col-span-1 p-4 border rounded shadow bg-white">
                    <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
                        Producto Ofrecido
                    </h2>
                    <div className="p-4 border rounded shadow-inner bg-gray-50">
                        <div className="w-full h-52 overflow-hidden rounded mb-4 bg-gray-200">
                            <img
                                src={exchange?.image_url}
                                alt={exchange?.sneaker_name || "Producto ofrecido"}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                            <strong>Modelo:</strong> {exchange?.sneaker_name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                            <strong>Talla:</strong> {exchange?.offered_size || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Condición:</strong> {exchange?.offered_condition || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Productos Solicitados */}
                <div className="col-span-2 p-4 border rounded shadow bg-white">
                    <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
                        Productos Solicitados
                    </h2>
                    <div
                        className={`grid ${exchange?.requested_sneakers?.length === 1
                            ? "grid-cols-1"
                            : exchange?.requested_sneakers?.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-3"
                            } gap-4`}
                    >
                        {exchange?.requested_sneakers?.length > 0 ? (
                            exchange.requested_sneakers.map((item, index) => (
                                <div key={index} className="p-3 border rounded shadow-inner bg-gray-50">
                                    <div className="w-full h-40 overflow-hidden rounded mb-3 bg-gray-200">
                                        <img
                                            src={item.image_url}
                                            alt={item.name || "Producto solicitado"}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-700 mb-1">
                                        <strong>Modelo:</strong> {item.name || "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <strong>Talla:</strong> {item.size || "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Condición:</strong> {item.condition || "N/A"}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-center text-gray-500">
                                No hay productos solicitados para este intercambio.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Botón para aceptar el intercambio */}
            {exchange ? (
                <div className="text-center mt-8">
                    {console.log("Renderizando botón. ID del intercambio:", exchange?.exchange_id)}
                    <button
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 focus:outline-none"
                        onClick={() => handleAcceptExchange(exchange.exchange_id)}
                    >
                        Aceptar Intercambio
                    </button>
                </div>
            ) : (
                <p className="text-center mt-8 text-gray-500">Cargando detalles del intercambio...</p>
            )}
        </div>
    );
}

export default AllExchangesDetails;
