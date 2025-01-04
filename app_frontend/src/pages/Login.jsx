import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Error al iniciar sesión");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      alert("Inicio de sesión exitoso");
      navigate("/home");
    } catch (error) {
      setError("Credenciales incorrectas");
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
            Login
          </h1>
        </div>

        <form
          className="p-8 flex flex-col space-y-4"
          onSubmit={handleLogin}
        >
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
            Iniciar Sesión
          </button>
        </form>

        {/* Registro */}
        <div className="flex justify-center py-4 bg-gray-100 rounded-b-lg">
          <p className="text-sm">
            ¿No tienes cuenta?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-accent cursor-pointer font-semibold hover:underline"
            >
              Regístrate aquí
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
