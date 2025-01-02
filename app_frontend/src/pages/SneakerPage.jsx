import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function SneakersPage() {
    const { category } = useParams(); // Obtener el parámetro dinámico
    const navigate = useNavigate(); // Hook para navegar
    const [sneakers, setSneakers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSneakers = async () => {
            try {
                const endpoint =
                    category === "all"
                        ? "http://localhost:3000/api/snkrs" // Todas las zapatillas
                        : `http://localhost:3000/api/snkrs/search?query=${category}`; // Filtro por categoría

                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const data = await response.json();
                setSneakers(data); // Guardar las zapatillas en el estado
            } catch (error) {
                console.error("Error al obtener zapatillas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSneakers();
    }, [category]);

    if (loading) {
        return <div className="p-4 text-center">Cargando productos...</div>;
    }

    // Lógica para el título dinámico
    const getTitle = () => {
        if (category === "all") {
            return "Todos los productos";
        }
        const capitalizedCategory =
            category.charAt(0).toUpperCase() + category.slice(1);
        return `Productos ${capitalizedCategory}`; // Mostrar solo la primera letra en mayúscula
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">{getTitle()}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {sneakers.map((snkr) => (
                    <div
                        key={snkr.id}
                        className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-300"
                        onClick={() => navigate(`/sneaker/${snkr.id}`)}
                    >
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img
                                src={snkr.image_url}
                                alt={snkr.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="p-4">
                            <h2 className="text-lg font-semibold truncate">{snkr.name}</h2>
                            <p className="text-sm text-gray-500 truncate">{snkr.colorway}</p>
                            <p className="text-sm text-gray-700 font-bold">
                                Precio: ${snkr.retail_price}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SneakersPage;
