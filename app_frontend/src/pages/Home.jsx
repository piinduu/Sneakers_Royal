import React from "react";
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

  const handleBrandClick = (category) => {
    navigate(`/sneakers/${category.toLowerCase()}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-black mb-4">Marcas Populares</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="cursor-pointer bg-light rounded-lg shadow-md p-4 flex flex-col items-center hover:bg-gray-200"
            onClick={() => handleBrandClick(brand.name)}
          >
            <img src={brand.image} alt={brand.name} className="w-20 h-20 object-contain mb-2" />
            <p className="font-semibold text-black">{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
