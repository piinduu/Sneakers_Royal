import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function SneakerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sneaker, setSneaker] = useState(null);
    const [relatedSneakers, setRelatedSneakers] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [lowestPrices, setLowestPrices] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSneakerDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("No estás autenticado. Por favor, inicia sesión.");
                    navigate("/login");
                    return;
                }

                // Fetch sneaker details
                const response = await fetch(`http://localhost:3000/api/snkrs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const data = await response.json();
                setSneaker(data);

                // Fetch lowest prices for sneaker sizes
                const lowestPricesResponse = await fetch(
                    `http://localhost:3000/api/prices/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!lowestPricesResponse.ok) {
                    throw new Error(`Error HTTP: ${lowestPricesResponse.status}`);
                }
                const lowestPricesData = await lowestPricesResponse.json();

                const pricesMap = {};
                for (let size = 35; size <= 50; size++) {
                    const found = lowestPricesData.find((item) => item.size === size.toString());
                    pricesMap[size] = found ? parseFloat(found.min_price) : parseFloat(data.retail_price);
                }

                setLowestPrices(pricesMap);

                // Fetch related sneakers
                const searchQuery = data.name.split(" ").slice(0, 2).join(" ");
                const relatedResponse = await fetch(
                    `http://localhost:3000/api/snkrs/search?query=${searchQuery}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!relatedResponse.ok) {
                    throw new Error(`Error HTTP: ${relatedResponse.status}`);
                }
                const relatedData = await relatedResponse.json();
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
    }, [id, navigate]);

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

        navigate("/purchase-summary", {
            state: {
                sneaker,
                selectedSize,
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
                    {[...Array(16)].map((_, index) => {
                        const size = 35 + index;
                        const price = lowestPrices[size];
                        const displayPrice =
                            typeof price === "number" ? price.toFixed(2) : "N/A";

                        return (
                            <button
                                key={size}
                                className={`border rounded-lg p-3 text-lg ${selectedSize === size
                                    ? "bg-red-500 text-white border-red-500"
                                    : "hover:bg-gray-100"
                                    }`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size} - €{displayPrice}
                            </button>
                        );
                    })}
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
