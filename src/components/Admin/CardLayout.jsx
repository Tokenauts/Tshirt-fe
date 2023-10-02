import React from "react";

const CardLayout = () => {
  // Hardcoded rating value for now
  const rating = 3;

  return (
    <div className="container mx-auto p-10 text-black">
      <div className="relative group rounded w-64 h-auto">
        {/* Image */}
        <img
          src="./Tshirt1.png"
          alt="Product Image"
          className="w-full h-64 object-cover rounded"
        />

        {/* Wishlist Button */}
        <button className="absolute top-1/2 -right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
          ♥
        </button>

        {/* Content below image */}
        <div className="p-4 text-white">
          {/* Title and Price */}
          <div className="grid grid-cols-2 w-full mb-2">
            <h1 className="text-left">Title</h1>
            <h1 className="text-right">Price</h1>
          </div>

          {/* Rating and View Button */}
          <div className="grid grid-cols-2 w-full">
            <div className="flex">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <span key={i}>{i < rating ? "★" : "☆"}</span>
                ))}
            </div>
            <button className="  bg-blue-500 hover:bg-blue-700 font-bold py-1  rounded text-center">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardLayout;
