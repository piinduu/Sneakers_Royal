import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const brands = [
  { name: "Jordan", image: "https://cdn.brandfetch.io/id6wb-J1GM/theme/dark/logo.svg" },
  { name: "Nike", image: "https://cdn.brandfetch.io/id_0dwKPKT/theme/dark/logo.svg" },
  { name: "Adidas", image: "https://cdn.brandfetch.io/idyqQWKFVE/w/800/h/537/theme/dark/idJ-IsoDll.png" },
  { name: "Yeezy", image: "https://cdn.brandfetch.io/iddDit-Je6/w/200/h/120/theme/dark/logo.png" },
  { name: "New Balance", image: "https://cdn.brandfetch.io/idjR6yqXUb/theme/dark/id6MQLb5ga.svg" },
];

function Home() {
  const navigate = useNavigate();
  const [popularSneakers, setPopularSneakers] = useState([]);
  const [trendingSneakers, setTrendingSneakers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para barajar un arreglo
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchSneakers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/snkrs");
        if (!response.ok) {
          throw new Error("Error al cargar las zapatillas");
        }
        const data = await response.json();

        // Barajamos los resultados antes de seleccionar los primeros elementos
        const popular = shuffleArray(
          data.filter((sneaker) => sneaker.retail_price >= 100 && sneaker.retail_price <= 200)
        ).slice(0, 4);

        const trending = shuffleArray(
          data.filter((sneaker) => sneaker.retail_price >= 80 && sneaker.retail_price <= 150)
        ).slice(0, 4);

        setPopularSneakers(popular);
        setTrendingSneakers(trending);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar las zapatillas:", err);
        setLoading(false);
      }
    };

    fetchSneakers();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      {/* Marcas populares */}
      <h2 className="text-lg font-bold text-black mb-4">Marcas Populares</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="cursor-pointer bg-light rounded-lg shadow-md p-4 flex flex-col items-center hover:bg-gray-200"
            onClick={() => navigate(`/sneakers/${brand.name.toLowerCase()}`)}
          >
            <img src={brand.image} alt={brand.name} className="w-16 h-16 object-contain mb-2" />
            <p className="font-semibold text-black text-sm">{brand.name}</p>
          </div>
        ))}
      </div>

      {/* Más Populares */}
      <h2 className="text-lg font-bold text-black mt-8 mb-4">Más Populares</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularSneakers.map((sneaker) => (
          <div
            key={sneaker.id}
            className="p-4 border rounded shadow hover:shadow-lg transition cursor-pointer bg-white"
            onClick={() => navigate(`/sneaker/${sneaker.id}`)}
          >
            <img
              src={sneaker.image_url}
              alt={sneaker.name}
              className="w-full h-40 object-contain mb-3 rounded"
            />
            <p className="font-semibold text-sm truncate">{sneaker.name}</p>
            <p className="text-sm text-gray-600">Precio: €{sneaker.retail_price}</p>
          </div>
        ))}
      </div>

      {/* Tendencias */}
      <h2 className="text-lg font-bold text-black mt-8 mb-4">Tendencias</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingSneakers.map((sneaker) => (
          <div
            key={sneaker.id}
            className="p-4 border rounded shadow hover:shadow-lg transition cursor-pointer bg-white"
            onClick={() => navigate(`/sneaker/${sneaker.id}`)}
          >
            <img
              src={sneaker.image_url}
              alt={sneaker.name}
              className="w-full h-40 object-contain mb-3 rounded"
            />
            <p className="font-semibold text-sm truncate">{sneaker.name}</p>
            <p className="text-sm text-gray-600">Precio: €{sneaker.retail_price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
