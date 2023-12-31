import React, { useState, useEffect } from "react";
import Card from "./Card";
import Loading from "../loading";
import { motion } from "framer-motion";
import Sidebar from "../Navbar/Sidebar";
const EXPRESS_SERVER_URL =
  "https://cooperative-shoulder-pads-colt.cyclic.cloud/products";

const GetProduct = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New state for loading

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(EXPRESS_SERVER_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch products from the express server");
        }
        const productsData = await response.json();
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setProducts(productsData);
        setIsLoading(false); // Set loading to false once products are fetched
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <div className="flex">
      <Sidebar className="z-10" />
      <motion.div
        className="items-center w-full px-5 py-24 mx-auto md:px-12 lg:px-16 max-w-7xl ml-64" // Add some left margin to make room for the sidebar
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ul className="grid grid-cols-2  md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mx-auto">
          {products.map((product, index) => (
            <li key={index} className="rounded">
              <Card
                imgSrc={product.fileHashes[0]} // Reference `fileHashes` here
                imgAlt={product.name}
                title={product.name}
                description={product.description}
                price={product.price}
                productId={product.id}
              />
            </li>
          ))}
        </ul>
      </motion.div>
      <cardComponent />
    </div>
  );
};

export default GetProduct;
