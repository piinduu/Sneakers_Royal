import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AllExchanges() {
    const [exchanges, setExchanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExchanges = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/exchanges/all");
                if (!response.ok) {
                    throw new Error("Error al obtener los datos del servidor");
                }
                const data = await response.json(); // Convierte la respuesta a JSON
                setExchanges(data);
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener intercambios activos:", err);
                setError("Error al cargar los intercambios.");
                setLoading(false);
            }
        };

        fetchExchanges();
    }, []);

    if (loading) return <p>Cargando intercambios...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Intercambios Activos</h1>
            {exchanges.length === 0 ? (
                <p className="text-center">No hay intercambios activos en este momento.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exchanges.map((exchange) => (
                        <div
                            key={exchange.id}
                            className="p-4 border rounded shadow hover:shadow-lg hover:bg-gray-100 transition cursor-pointer text-center"
                            onClick={() => navigate(`/exchanges/details/${exchange.id}`)}
                        >
                            <img
                                src={exchange.image_url}
                                alt={exchange.sneaker_name}
                                className="w-3/4 h-32 object-cover mx-auto mb-4 rounded"
                            />
                            <h2 className="text-lg font-bold">{exchange.sneaker_name}</h2>
                            <p className="text-sm">Talla: {exchange.size}</p>
                            <p className="text-sm">Condición: {exchange.condition}</p>
                            <p className="text-sm">Días restantes: {exchange.time_left}</p>
                            <p className="text-sm text-gray-500">
                                Propietario: {exchange.owner || "N/A"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllExchanges;
