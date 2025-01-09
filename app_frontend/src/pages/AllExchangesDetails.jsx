import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AllExchangesDetails() {
    const { id } = useParams(); // Obtener el ID del intercambio desde la URL
    const [exchange, setExchange] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExchangeDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/exchanges/${id}`);
                if (!response.ok) {
                    throw new Error("Error al obtener los detalles del intercambio");
                }
                const data = await response.json();
                setExchange(data);
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener detalles del intercambio:", err);
                setError("No se pudieron cargar los detalles del intercambio.");
                setLoading(false);
            }
        };

        fetchExchangeDetails();
    }, [id]);

    if (loading) return <p className="text-center mt-8">Cargando detalles...</p>;
    if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-xl font-bold mb-4 text-center text-gray-800">
                Detalles del Intercambio
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Producto Ofrecido */}
                <div className="p-3 border rounded shadow bg-white">
                    <h2 className="text-md font-semibold mb-2 text-center text-gray-700">
                        Producto Ofrecido
                    </h2>
                    <div className="p-3 border rounded shadow-inner bg-gray-50">
                        <div className="aspect-w-1 aspect-h-1 w-3/4 mx-auto overflow-hidden rounded mb-3 bg-gray-200">
                            <img
                                src={exchange.image_url}
                                alt={exchange.sneaker_name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <p className="text-sm text-gray-700"><strong>Modelo:</strong> {exchange.sneaker_name}</p>
                        <p className="text-sm text-gray-600"><strong>Talla:</strong> {exchange.offered_size}</p>
                        <p className="text-sm text-gray-600"><strong>Condición:</strong> {exchange.offered_condition}</p>
                    </div>
                </div>

                {/* Productos Solicitados */}
                <div className="p-3 border rounded shadow bg-white">
                    <h2 className="text-md font-semibold mb-2 text-center text-gray-700">
                        Productos Solicitados
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        {exchange.requested_sneakers.length > 0 ? (
                            exchange.requested_sneakers.map((item, index) => (
                                <div key={index} className="p-3 border rounded shadow-inner bg-gray-50">
                                    <div className="aspect-w-1 aspect-h-1 w-3/4 mx-auto overflow-hidden rounded mb-3 bg-gray-200">
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-700"><strong>Modelo:</strong> {item.name}</p>
                                    <p className="text-sm text-gray-600"><strong>Talla:</strong> {item.size}</p>
                                    <p className="text-sm text-gray-600"><strong>Condición:</strong> {item.condition}</p>
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
        </div>
    );
}

export default AllExchangesDetails;
