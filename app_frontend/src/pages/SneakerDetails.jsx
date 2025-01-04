import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function SneakerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sneaker, setSneaker] = useState(null);
    const [relatedSneakers, setRelatedSneakers] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSneakerDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/snkrs/${id}`);
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const data = await response.json();
                setSneaker(data);

                // Buscar productos relacionados
                const searchQuery = data.name.split(" ").slice(0, 2).join(" ");
                const relatedResponse = await fetch(
                    `http://localhost:3000/api/snkrs/search?query=${searchQuery}`
                );
                if (!relatedResponse.ok) {
                    throw new Error(`Error HTTP: ${relatedResponse.status}`);
                }
                const relatedData = await relatedResponse.json();

                // Filtrar relacionados y seleccionar aleatorios
                const filteredRelatedSneakers = relatedData
                    .filter((item) => item.id !== data.id)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3);

                setRelatedSneakers(filteredRelatedSneakers);
            } catch (error) {
                console.error("Error al obtener detalles de la zapatilla:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSneakerDetails();
    }, [id]);

    if (loading) {
        return <div className="p-4 text-lg font-bold">Cargando detalles...</div>;
    }

    if (!sneaker) {
        return <div className="p-4 text-lg font-bold">Zapatilla no encontrada.</div>;
    }

    const manufacturer = sneaker.name.split(" ")[0];
    const capitalizedTitle =
        sneaker.name.charAt(0).toUpperCase() + sneaker.name.slice(1);

    const handlePurchase = () => {
        if (!selectedSize) {
            alert("Por favor, selecciona una talla antes de comprar.");
            return;
        }

        // Redirigir a PurchaseSummary con los datos necesarios
        navigate("/purchase-summary", {
            state: {
                sneaker, // Enviar detalles del producto
                selectedSize, // Enviar talla seleccionada
            },
        });
    };

    return (
        <div className="grid grid-cols-12 gap-8 p-12 max-w-screen-xl mx-auto">
            {/* Top Left: Imagen y título */}
            <div className="col-span-6 flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-6 text-center">{capitalizedTitle}</h1>
                <img
                    src={sneaker.image_url}
                    alt={sneaker.name}
                    className="w-4/5 h-auto rounded-lg shadow-lg object-contain"
                />
            </div>

            {/* Top Right: Selector de tallas */}
            <div className="col-span-6">
                <h2 className="text-2xl font-bold mb-4">Seleccionar talla</h2>
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(16)].map((_, index) => (
                        <button
                            key={index}
                            className={`border rounded-lg p-3 text-lg ${selectedSize === 35 + index
                                ? "bg-red-500 text-white border-red-500"
                                : "hover:bg-gray-100"
                                }`}
                            onClick={() => setSelectedSize(35 + index)}
                        >
                            {35 + index} - ${sneaker.retail_price}
                        </button>
                    ))}
                </div>
                <button
                    className="mt-6 bg-black text-white py-3 px-6 rounded text-lg w-full hover:bg-gray-800"
                    onClick={handlePurchase}
                >
                    Compra Ahora
                </button>
            </div>

            {/* Bottom Left: Productos relacionados */}
            <div className="col-span-6">
                <h2 className="text-2xl font-bold mb-4">Productos relacionados</h2>
                <div className="flex gap-4">
                    {relatedSneakers.map((related) => (
                        <div
                            key={related.id}
                            className="cursor-pointer w-1/3"
                            onClick={() => navigate(`/sneaker/${related.id}`)}
                        >
                            <img
                                src={related.image_url}
                                alt={related.name}
                                className="w-full h-32 object-contain rounded-lg shadow-md"
                            />
                            <h3 className="text-center text-sm font-medium mt-2 truncate">
                                {related.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Right: Detalles del producto */}
            <div className="col-span-6">
                <h2 className="text-2xl font-bold mb-4">Detalles del producto</h2>
                <p className="text-lg mb-2">
                    <strong>Fabricante:</strong> {manufacturer}
                </p>
                <p className="text-lg mb-2">
                    <strong>Style ID:</strong> {sneaker.style_id}
                </p>
                <p className="text-lg mb-2">
                    <strong>Fecha de lanzamiento:</strong> {sneaker.release_date}
                </p>
            </div>
        </div>
    );
}

export default SneakerDetails;
