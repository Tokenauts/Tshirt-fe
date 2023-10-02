import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion

const Card = ({ imgSrc, imgAlt, title, description, price, productId }) => {
  const videoRef = useRef(null);
  const rating = 3;
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: productId * 0.2,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Link
        to={`/product/${productId}`}
        className="relative group w-full md:w-1/2 lg:w-1/3 xl:w-1/4 h-60 md:h-80 overflow-hidden hover:scale-105 transition-transform duration-300"
      >
        <div className="container mx-auto p-10 text-black">
          <div className="relative group rounded w-64 h-auto ">
            {/* Image */}
            <img
              src={imgSrc}
              alt="Product Image"
              className="w-full h-64 object-cover rounded "
            />

            {/* Wishlist Button */}
            <button className="absolute top-1/2 -right-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
              ♥
            </button>

            {/* Content below image */}
            <div className="p-4 text-white">
              {/* Title and Price */}
              <div className="grid grid-cols-2 w-full mb-2">
                <h1 className="text-left">{title}</h1>
                <h1 className="text-right">{price}</h1>
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
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Card;
