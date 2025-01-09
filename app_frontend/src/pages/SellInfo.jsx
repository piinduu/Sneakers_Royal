import React from "react";
import { useNavigate } from "react-router-dom";

function SellInfo() {
    const navigate = useNavigate();

    return (
        <div className="max-w-screen-lg mx-auto p-6 text-center">
            <h1 className="text-3xl font-bold mb-6">Así es como funciona</h1>
            <div className="space-y-8 flex flex-col items-center">
                {/* Paso 1 */}
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white text-lg font-bold rounded-full mb-4">
                        1
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Escoge el artículo que quieres vender</h2>
                        <p className="text-gray-600">
                            ¿No está el artículo en la lista? Escribe un correo electrónico.
                        </p>
                    </div>
                </div>

                {/* Paso 2 */}
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white text-lg font-bold rounded-full mb-4">
                        2
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Elija el precio al que quiere vender</h2>
                        <p className="text-gray-600">
                            Tiene que tener en cuenta que compite contra otros y predomina el precio más bajo.
                        </p>
                    </div>
                </div>

                {/* Paso 3 */}
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white text-lg font-bold rounded-full mb-4">
                        3
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Una vez vendido, envíenos el artículo</h2>
                        <p className="text-gray-600">
                            Una vez llegue a nuestros almacenes, lo autentificaremos y recibirá su dinero.
                        </p>
                    </div>
                </div>
            </div>

            {/* Botones */}
            <div className="flex justify-center mt-8 space-x-4">
                <button
                    className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
                    onClick={() => navigate("/home")}
                >
                    Cancelar
                </button>
                <button
                    className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
                    onClick={() => navigate("/sell/details")}
                >
                    Continuar
                </button>
            </div>
        </div>
    );
}

export default SellInfo;
