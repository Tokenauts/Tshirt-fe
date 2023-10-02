import React, { useState } from "react";

const Sidebar = () => {
  const [minPrice, setMinPrice] = useState(20);
  const [maxPrice, setMaxPrice] = useState(80);
  const [selectedCategory, setSelectedCategory] = useState("Web3");
  const [brands, setBrands] = useState(["Brand1", "Brand2"]); // Initially set to some default values

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);

    // Update brands based on the selected category
    if (newCategory === "Web3") {
      setBrands(["Brand1", "Brand2"]);
    } else if (newCategory === "Anime") {
      setBrands(["BrandA", "BrandB"]);
    } else if (newCategory === "Tokenauts Orignals") {
      setBrands(["BrandX", "BrandY"]);
    }
  };
  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value < maxPrice) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value > minPrice) {
      setMaxPrice(value);
    }
  };
  return (
    <div className="fixed top-0 left-0 w-64 h-screen  text-white p-6 overflow-y-auto mt-24">
      {/* Search Box */}
      <div className="mb-6 relative">
        <input
          type="text"
          className="w-full p-2 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600 text-black"
          placeholder="Search products..."
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Filters */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-blue-300">Filters</h3>

        {/* Category Filter */}
        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            className="w-full p-2 border rounded bg-gray-700 text-white"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="Web3">Web3</option>
            <option value="Anime">Anime</option>
            <option value="Tokenauts Orignals">Tokenauts Orignals</option>
          </select>
        </div>

        {/*price Filter*/}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Price Range</label>
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full"
            />
            <span className="ml-2 text-white">{`$${minPrice}`}</span>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="range"
              min="0"
              max="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full"
            />
            <span className="ml-2 text-white">{`$${maxPrice}`}</span>
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Brand</label>
          <select className="w-full p-2 border rounded bg-gray-700 text-white">
            {brands.map((brand, index) => (
              <option key={index}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Apply Filters Button */}
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
