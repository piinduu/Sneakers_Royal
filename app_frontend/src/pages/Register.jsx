import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                throw new Error("Error al registrar usuario");
            }

            alert("Registro exitoso. Por favor, inicia sesión.");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div
            className="h-screen flex items-center justify-center bg-gradient-to-b from-secondary to-accent relative overflow-hidden"
        >
            {/* Fondo con zapatillas */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url('https://img.icons8.com/pastel-glyph/128/sneaker--v2.png')`,
                    backgroundSize: "80px",
                    backgroundRepeat: "repeat",
                    opacity: 0.2, // Ajusta la visibilidad del patrón
                }}
            ></div>

            {/* Contenedor principal */}
            <div className="bg-light rounded-lg shadow-lg w-full max-w-md z-10">
                {/* Parte superior curva */}
                <div className="relative w-full h-32 bg-gradient-to-r from-primary to-secondary rounded-t-lg">
                    <h1 className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
                        Regístrate
                    </h1>
                </div>

                <form
                    className="p-8 flex flex-col space-y-4"
                    onSubmit={handleRegister}
                >
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold">
                            Nombre de Usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full p-3 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-3 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-3 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 font-semibold">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-accent"
                    >
                        Registrarse
                    </button>
                </form>

                {/* Redirección a Login */}
                <div className="flex justify-center py-4 bg-gray-100 rounded-b-lg">
                    <p className="text-sm">
                        ¿Ya tienes una cuenta?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-accent cursor-pointer font-semibold hover:underline"
                        >
                            Inicia Sesión
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
