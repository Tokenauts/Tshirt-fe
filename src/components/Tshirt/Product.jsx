import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import Loading from "../loading";

import { motion } from "framer-motion"; // Import framer-motion

const contractaddress = "0x6edA69F4367deD9221aF2d96ADbEb52b139e9aCE";

const Product = () => {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [cart, setCart] = useState([]);
  const { id } = useParams();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true); // New state for loading

  const videoHash = product?.fileTypes.includes("video")
    ? product.fileHashes[product.fileTypes.indexOf("video")]
    : null;
  const imageHash = product?.fileTypes.includes("image")
    ? product.fileHashes[product.fileTypes.indexOf("image")]
    : null;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://cooperative-shoulder-pads-colt.cyclic.cloud/products/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product details.");
        }
        const productData = await response.json();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setProduct(productData);
        setIsLoading(false); // Set loading to false once products are fetched
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Add to Cart
  const addToCart = async (product, selectedSize) => {
    const userId = address; // Assuming the wallet address is the user ID.
    const Tprice = product.price.toString(); // Convert the BigInt price to a string

    try {
      const response = await fetch(
        "https://cooperative-shoulder-pads-colt.cyclic.cloud/addtocart",
        {
          // Replace with your backend URL
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId: product.id,
            quantity: 1, // You can change this to let the user specify a quantity
            size: selectedSize,
            fileHash: videoHash,
            name: product.name,
            price: Tprice, // Using the string-converted price
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCart(data);
        const event = new Event("cartUpdated");
        window.dispatchEvent(event);
      } else {
        console.log("Failed to add to cart. HTTP Status:", response.status); // Debug line
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  // Remove from Cart (To be called when needed)

  // Fetch cart (Call this function in useEffect or whenever needed)
  const getCart = async () => {
    const userId = address; // Assuming the wallet address is the user ID.
    try {
      const response = await fetch(
        `https://cooperative-shoulder-pads-colt.cyclic.cloud/getcart/${userId}`
      ); // Replace with your backend URL
      const data = await response.json();
      setCart(data);
    } catch (err) {
      console.error("Failed to get cart:", err);
    }
  };

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  const videoVariants = {
    hidden: { opacity: 0, x: "-100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", damping: 20, stiffness: 100 },
    },
  };

  const infoVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", damping: 20, stiffness: 100 },
    },
  };

  return (
    <div className="flex w-full h-full p-12 bg-slate-900     max-w-7xl mx-auto">
      {/* Video Section */}
      <motion.div
        className="flex-1 p-6 bg-slate-900 rounded-lg"
        variants={videoVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex-1 p-6 bg-slate-900     ">
          {videoHash && (
            <video className="h-full" src={videoHash} autoPlay muted loop>
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </motion.div>

      {/* Product Information Section */}
      <motion.div
        className="flex-1 p-6 ml-12 bg-white rounded-lg"
        variants={infoVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex-1 p-6 ml-12 bg-white rounded-lg">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="mt-4 mb-8 text-gray-700">{product.description}</p>
          <h3 className="text-xl font-bold">Price: ${product.price}</h3>

          {/* Sizes */}
          <div className="mt-6">
            <label className="block mb-2 text-lg font-medium">Size:</label>
            <div className="flex space-x-4">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-full border-2 ${
                    selectedSize === size
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Address */}

          {/* Cart Operations */}
          <div className="mt-6">
            <button
              onClick={() => {
                if (!selectedSize) {
                  alert("Please select a size first.");
                  return;
                }
                if (!address) {
                  alert("Please connect wallet First");
                  return;
                }
                addToCart(product, selectedSize);
              }}
              className="w-40 p-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Add to cart
            </button>
          </div>

          {/* Buy Now Button */}
        </div>
      </motion.div>
    </div>
  );

  // Return statement would be here.
};

export default Product;
