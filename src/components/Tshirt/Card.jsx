import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion

const Card = ({ imgSrc, imgAlt, title, description, price, productId }) => {
  const videoRef = useRef(null);

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: productId * 0.2, // Assuming productId is a number starting from 1
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Link
        to={`/product/${productId}`}
        className="relative group w-full h-80 overflow-hidden hover:scale-102 transition-transform duration-700 "
      >
        <img
          ref={videoRef}
          className="w-full h-full object-cover"
          src={imgSrc}
          alt={imgAlt}
        />

        {/* Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-20 rounded-md  transition-opacity duration-700"></div>

        {/* Product Info */}
        <figcaption className="absolute bottom-0 w-full transform group-hover:translate-y-20% transition-transform duration-300 p-4">
          <p className="text-xl font-semibold text-white mb-2 opacity-0 group-hover:opacity-100">
            {title}
          </p>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-base text-gray-400 mb-3">{description}</p>
            <div className="flex justify-between items-center mt-4">
              <p className="text-lg font-medium text-white">{price} ETH</p>
              <button className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300">
                View
              </button>
            </div>
          </div>
        </figcaption>
      </Link>
    </motion.div>
  );
};

export default Card;
