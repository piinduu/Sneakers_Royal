import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SellSetPrice() {
    const navigate = useNavigate();
    const location = useLocation();
    const { sneaker } = location.state || {};

    const [selectedSize, setSelectedSize] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [lowestPrice, setLowestPrice] = useState(null);
    const [duration, setDuration] = useState("");
    const [isCheapest, setIsCheapest] = useState(false);
    const [fees, setFees] = useState({
        processingFee: 0,
        payout: 0,
    });
    const [agreementChecked, setAgreementChecked] = useState(false);

    // Fetch lowest price for the sneaker
    useEffect(() => {
        if (!sneaker) {
            alert("No se encontró información de la zapatilla.");
            navigate("/sell");
            return;
        }

        const fetchLowestPrice = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Usuario no autenticado.");
                }

                const response = await fetch(
                    `http://localhost:3000/api/prices/${sneaker.id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al obtener el precio más bajo.");
                }

                const data = await response.json();
                setLowestPrice(data.lowestPrice || null);
            } catch (error) {
                console.error("Error al obtener el precio más bajo:", error);
            }
        };

        fetchLowestPrice();
    }, [sneaker, navigate]);

    // Calculate fees whenever sellingPrice changes
    useEffect(() => {
        const calculateFees = () => {
            const processingFee = sellingPrice ? (sellingPrice * 0.05).toFixed(2) : 0; // 5% fee
            const payout = sellingPrice ? (sellingPrice - processingFee).toFixed(2) : 0;

            setFees({
                processingFee: parseFloat(processingFee),
                payout: parseFloat(payout),
            });

            if (sellingPrice && lowestPrice && sellingPrice < lowestPrice) {
                setIsCheapest(true);
            } else {
                setIsCheapest(false);
            }
        };

        calculateFees();
    }, [sellingPrice, lowestPrice]);

    const handleConfirm = async () => {
        if (!selectedSize || !sellingPrice || !duration || !agreementChecked) {
            alert("Por favor, completa todos los campos y acepta los términos.");
            return;
        }

        const sellDetails = {
            snkr_id: sneaker.id,
            size: selectedSize,
            price: sellingPrice,
            duration,
        };

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("No estás autenticado. Por favor, inicia sesión.");
                navigate("/login");
                return;
            }

            const response = await fetch("http://localhost:3000/api/prices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(sellDetails),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
                return;
            }

            alert("¡Anuncio creado con éxito!");
            navigate("/home");
        } catch (error) {
            console.error("Error al guardar los detalles de venta:", error);
            alert("Hubo un problema al guardar el anuncio.");
        }
    };

    if (!sneaker) return null;

    return (
        <div className="max-w-screen-lg mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">{sneaker.name}</h1>
            <div className="text-center mb-6">
                <img
                    src={sneaker.image_url}
                    alt={sneaker.name}
                    className="w-48 h-48 mx-auto object-contain"
                />
                <p className="text-gray-600 text-sm mt-2">SKU: {sneaker.style_id}</p>
            </div>

            <div className="bg-gray-100 p-6 rounded shadow-lg">
                <div className="mb-4">
                    <label htmlFor="size" className="block text-lg font-bold mb-2">
                        Selecciona tu talla
                    </label>
                    <select
                        id="size"
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona una talla</option>
                        {[...Array(16)].map((_, i) => (
                            <option key={i} value={35 + i}>
                                {35 + i}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="price" className="block text-lg font-bold mb-2">
                        Tu precio de venta (€)
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Precio más bajo: €${lowestPrice || "..."}`}
                    />
                    {isCheapest && <p className="text-green-500 mt-2">¡Eres el más barato!</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="duration" className="block text-lg font-bold mb-2">
                        ¿Por cuánto tiempo quieres anunciarte?
                    </label>
                    <select
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona el tiempo</option>
                        <option value="7">7 días</option>
                        <option value="14">14 días</option>
                        <option value="30">30 días</option>
                    </select>
                </div>

                <div className="bg-white p-4 rounded shadow mt-4">
                    <p>Comisión de procesamiento (5%): - €{fees.processingFee}</p>
                    <hr className="my-2" />
                    <p className="font-bold">Payout: €{fees.payout}</p>
                </div>

                <div className="mt-4">
                    <label className="flex items-start space-x-2">
                        <input
                            type="checkbox"
                            checked={agreementChecked}
                            onChange={(e) => setAgreementChecked(e.target.checked)}
                        />
                        <span className="text-sm">
                            Confirmo que el artículo es nuevo y auténtico, sin defectos ni piezas
                            faltantes.
                        </span>
                    </label>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
                    onClick={() => navigate("/sell/details")}
                >
                    Cancelar
                </button>
                <button
                    className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
                    onClick={handleConfirm}
                >
                    Confirmar
                </button>
            </div>
        </div>
    );
}

export default SellSetPrice;
