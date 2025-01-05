import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ExchangeDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sneaker } = location.state || {};

    const [selectedSize, setSelectedSize] = useState("");
    const [condition, setCondition] = useState("");
    const [listingDuration, setListingDuration] = useState("");

    if (!sneaker) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Error</h1>
                <p>No se encontraron datos del intercambio. Por favor, vuelve a intentarlo.</p>
                <button
                    className="bg-accent text-white py-2 px-4 rounded hover:bg-muted mt-4"
                    onClick={() => navigate("/new-exchange")}
                >
                    Volver
                </button>
            </div>
        );
    }

    const handleConfirm = async () => {
        if (!selectedSize || !condition || !listingDuration) {
            alert("Por favor, completa todos los campos antes de confirmar.");
            return;
        }

        const exchangeDetails = {
            snkr_id: sneaker.id,
            size: selectedSize,
            condition,
            duration: listingDuration,
        };

        console.log("Datos enviados al backend:", exchangeDetails);

        const token = localStorage.getItem("token");
        console.log("Token enviado al backend:", token); // Agrega este log
        if (!token) {
            alert("No estás autenticado. Por favor, inicia sesión.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/exchanges", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(exchangeDetails),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error del backend:", errorData);
                throw new Error("Error al guardar el intercambio.");
            }

            const exchangeData = await response.json();
            console.log("Respuesta del backend:", exchangeData);
            navigate("/exchange-request", { state: { exchangeData } });
        } catch (error) {
            console.error("Error al guardar el intercambio:", error);
            alert("Hubo un problema al guardar el intercambio.");
        }
    };


    return (
        <div className="max-w-screen-lg mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Detalles del Intercambio</h1>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">{sneaker.name}</h2>
                <img
                    src={sneaker.image_url}
                    alt={sneaker.name}
                    className="mx-auto w-48 h-48 object-contain rounded-lg shadow-md"
                />
                <p className="text-gray-600 text-sm mt-4">ID: {sneaker.style_id}</p>
            </div>
            <div className="bg-gray-100 p-6 rounded shadow-lg">
                <div className="mb-6">
                    <label htmlFor="size" className="block text-lg font-bold mb-2">
                        Selecciona tu talla
                    </label>
                    <select
                        id="size"
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        <option value="">Selecciona una talla</option>
                        {[...Array(16)].map((_, i) => (
                            <option key={i} value={35 + i}>
                                {35 + i}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-6">
                    <label htmlFor="condition" className="block text-lg font-bold mb-2">
                        Estado del producto
                    </label>
                    <select
                        id="condition"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        <option value="">Selecciona el estado</option>
                        <option value="nuevo">Nuevo</option>
                        <option value="nuevo-con-defectos">Nuevo con defectos</option>
                        <option value="usado">Usado</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label htmlFor="duration" className="block text-lg font-bold mb-2">
                        Tiempo de anuncio
                    </label>
                    <select
                        id="duration"
                        value={listingDuration}
                        onChange={(e) => setListingDuration(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        <option value="">Selecciona el tiempo</option>
                        <option value="7">7 días</option>
                        <option value="15">15 días</option>
                        <option value="30">30 días</option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <button
                        className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
                        onClick={() => navigate("/new-exchange")}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-accent text-white py-2 px-6 rounded hover:bg-muted"
                        onClick={handleConfirm}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ExchangeDetails;
