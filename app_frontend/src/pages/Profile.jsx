import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [userData, setUserData] = useState({
        username: "NuevoNombre",
        email: "nuevoemail@example.com",
        direccion: "Nueva Dirección",
        telefono: "123456789",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("No estás autenticado. Por favor, inicia sesión.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/users/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const updatedUser = await response.json();
            console.log("Usuario actualizado:", updatedUser);
            alert("Cambios confirmados con éxito.");
            navigate("/home");
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            alert("Hubo un problema al confirmar los cambios.");
        }
    };

    return (
        <div className="flex justify-center items-start bg-white pt-10 min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                        alt="User Icon"
                        className="w-20 h-20 mb-4"
                    />
                    <h1 className="text-2xl font-bold">Mi Perfil</h1>
                </div>
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Nombre de usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                            Dirección
                        </label>
                        <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            value={userData.direccion}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                            Teléfono
                        </label>
                        <input
                            type="text"
                            id="telefono"
                            name="telefono"
                            value={userData.telefono}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        Confirmar cambios
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
