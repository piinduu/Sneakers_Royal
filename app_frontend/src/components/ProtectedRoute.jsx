import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        // Si no hay token, redirige al login
        return <Navigate to="/login" />;
    }

    // Si hay token, renderiza el contenido protegido
    return children;
}

export default ProtectedRoute;
