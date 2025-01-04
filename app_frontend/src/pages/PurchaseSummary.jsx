import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Subheader from "../components/Subheader";

function PurchaseSummary() {
    const navigate = useNavigate();
    const location = useLocation();
    const { sneaker, selectedSize } = location.state || {};
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Error al obtener los datos del usuario");
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserDetails();
    }, []);

    if (!sneaker || !selectedSize) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Información incompleta</h1>
                <p>Por favor, selecciona un producto y vuelve a intentarlo.</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Cargando información del usuario...</h1>
            </div>
        );
    }

    const iva = (sneaker.retail_price * 0.21).toFixed(2);
    const total = (parseFloat(sneaker.retail_price) + parseFloat(iva)).toFixed(2);

    const handleConfirm = () => {
        alert("¡Compra confirmada! Gracias por tu compra.");
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/home");
        } else {
            navigate("/");
        }
    };

    return (
        <>
            <Header />
            <Subheader />
            <div className="max-w-screen-lg mx-auto p-6">
                <h1 className="text-3xl font-bold text-center mb-8">RESUMEN DE COMPRA</h1>
                <div className="grid grid-cols-2 gap-8">
                    {/* Product Summary */}
                    <div className="border p-6 rounded shadow flex flex-col items-center text-center">
                        <h2 className="text-xl font-bold mb-4">{sneaker.name}</h2>
                        <img
                            src={sneaker.image_url}
                            alt={sneaker.name}
                            className="w-full h-48 object-contain mb-4"
                        />
                        <p className="text-lg">
                            <strong>ID:</strong> {sneaker.style_id}
                        </p>
                        <p className="text-lg">
                            <strong>Talla:</strong> {selectedSize}
                        </p>
                        <hr className="my-4 w-full" />
                        <p className="text-lg">
                            <strong>Subtotal:</strong> ${sneaker.retail_price}
                        </p>
                        <p className="text-lg">
                            <strong>IVA (21%):</strong> ${iva}
                        </p>
                        <hr className="my-4 w-full" />
                        <p className="text-lg font-bold">
                            <strong>Total:</strong> ${total}
                        </p>
                    </div>

                    {/* User Information */}
                    <div className="border p-4 rounded shadow flex flex-col items-center text-center max-w-xs mx-auto self-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                            alt="User Icon"
                            className="w-16 h-16 mb-4"
                        />
                        <p className="text-lg">
                            <strong>Nombre de usuario:</strong> {user.username}
                        </p>
                        <p className="text-lg">
                            <strong>Correo electrónico:</strong> {user.email}
                        </p>
                        <p className="text-lg">
                            <strong>Dirección:</strong> {user.direccion || "No especificada"}
                        </p>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <button
                        className="bg-red-500 text-white py-3 px-6 rounded text-lg hover:bg-red-600"
                        onClick={handleConfirm}
                    >
                        CONFIRMAR
                    </button>
                </div>
            </div>
        </>
    );
}

export default PurchaseSummary;
