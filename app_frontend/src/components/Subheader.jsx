import React from "react";
import { Link } from "react-router-dom";

function Subheader() {
    return (
        <div className="bg-gray-500 text-white py-2 px-6">
            <nav className="flex justify-around">
                <Link
                    to="/sneakers/all"
                    className="text-sm font-bold hover:text-accent transition-colors"
                >
                    Todos los productos
                </Link>
                <Link
                    to="/sneakers/nike"
                    className="text-sm font-bold hover:text-accent transition-colors"
                >
                    Nike
                </Link>
                <Link
                    to="/sneakers/adidas"
                    className="text-sm font-bold hover:text-accent transition-colors"
                >
                    Adidas
                </Link>
                <Link
                    to="/sneakers/jordan" // Actualizado a "jordan"
                    className="text-sm font-bold hover:text-accent transition-colors"
                >
                    Air Jordan
                </Link>
                <Link
                    to="/sneakers/new-balance"
                    className="text-sm font-bold hover:text-accent transition-colors"
                >
                    New Balance
                </Link>
                <Link
                    to="/sneakers/yeezy"
                    className="text-sm font-bold hover:text-accent transition-colors"
                >
                    Yeezy
                </Link>
                <Link
                    to="/sneakers/upcoming"
                    className="text-sm font-bold hover:text-accent transition-colors"
                >
                    Próximos lanzamientos
                </Link>
            </nav>
        </div>
    );
}

export default Subheader;
