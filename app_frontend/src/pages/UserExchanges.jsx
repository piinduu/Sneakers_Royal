import React, { useEffect, useState } from "react";

function UserExchanges() {
    const [exchanges, setExchanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserExchanges = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("No estás autenticado. Por favor, inicia sesión.");
                    window.location.href = "/";
                    return;
                }

                const response = await fetch("http://localhost:3000/api/exchanges", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Error al obtener los intercambios del usuario.");
                }

                const data = await response.json();
                setExchanges(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserExchanges();
    }, []);

    const handleDelete = async (exchangeId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("No estás autenticado. Por favor, inicia sesión.");
                window.location.href = "/";
                return;
            }

            const response = await fetch(`http://localhost:3000/api/exchanges/${exchangeId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el intercambio.");
            }

            alert("Intercambio eliminado con éxito.");
            setExchanges((prevExchanges) =>
                prevExchanges.filter((exchange) => exchange.id !== exchangeId)
            );
        } catch (error) {
            console.error("Error al eliminar el intercambio:", error);
            alert("Hubo un problema al eliminar el intercambio.");
        }
    };

    const calculateDaysRemaining = (createdAt, duration) => {
        const createdDate = new Date(createdAt);
        const expirationDate = new Date(createdDate);
        expirationDate.setDate(createdDate.getDate() + duration);

        const now = new Date();
        const diffTime = expirationDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? `${diffDays} días restantes` : "Expirado";
    };

    const truncateName = (name, maxWords) => {
        const words = name.split(" ");
        return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : name;
    };

    if (loading) {
        return <div className="text-center mt-8">Cargando intercambios...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    if (exchanges.length === 0) {
        return <div className="text-center mt-8">No tienes intercambios realizados.</div>;
    }

    return (
        <div className="max-w-screen-lg mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Mis Intercambios</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exchanges.map((exchange) => (
                    <div
                        key={exchange.id}
                        className="border p-4 rounded shadow flex flex-col justify-between h-full"
                    >
                        <div className="flex flex-col items-center">
                            <img
                                src={exchange.image_url}
                                alt={exchange.sneaker_name}
                                className="w-24 h-24 object-contain rounded mb-4"
                            />
                            <p className="font-semibold text-center mb-2">
                                {truncateName(exchange.sneaker_name, 4)}
                            </p>
                            <p className="text-sm text-gray-500 text-center">
                                Modelo: {truncateName(exchange.sneaker_name, 4)}
                            </p>
                            <p className="text-sm text-gray-500 text-center">Talla: {exchange.size}</p>
                        </div>
                        <div className="mt-4 text-center flex-1 flex flex-col justify-between">
                            <div>
                                <p className="text-sm">Estado: {exchange.condition}</p>
                                <p className="text-sm">Estado del intercambio: {exchange.status}</p>
                                <p className="text-sm">
                                    Tiempo restante:{" "}
                                    {calculateDaysRemaining(exchange.created_at, exchange.duration)}
                                </p>
                                <p className="text-sm">
                                    Creado el: {new Date(exchange.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                    onClick={() => handleDelete(exchange.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserExchanges;
