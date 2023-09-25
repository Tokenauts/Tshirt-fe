import React, { useState, useEffect } from "react";
import { useContractWrite } from "wagmi";
import ABI from "../../utils/abi.json";
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

  const { write: buyProductWrite } = useContractWrite({
    address: contractaddress,
    abi: ABI,
    functionName: "buyProduct",
  });

  const updateCartOnServer = async (updatedCart) => {
    try {
      const cartData = { cart: updatedCart };
      console.log("Sending cart data:", cartData);
      await fetch(`http://localhost:3001/updateCart/${address}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart: updatedCart }),
      });

      // Dispatch the event only after the server update is complete:
      const event = new Event("cartUpdated");
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error updating cart on server:", error);
    }
  };

  const fetchCartFromServer = async () => {
    try {
      // const response = await fetch(`http://localhost:3001/getCart/${address}`);
      // const serverCart = await response.json();
      // setCart(serverCart);
    } catch (error) {
      console.error("Error fetching cart from server:", error);
    }
  };
  const videoHash = product?.fileTypes.includes("video")
    ? product.fileHashes[product.fileTypes.indexOf("video")]
    : null;
  const imageHash = product?.fileTypes.includes("image")
    ? product.fileHashes[product.fileTypes.indexOf("image")]
    : null;

  useEffect(() => {
    fetchCartFromServer();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://cooperative-shoulder-pads-colt.cyclic.cloud/products/${id}`
        );
        console.log(response);
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

  const findCartItemBySize = (productId, size) => {
    return cart.find(
      (item) => item.product.id === productId && item.size === size
    );
  };

  const addToCart = (product, size) => {
    const existingCartItem = findCartItemBySize(product.id, size);
    if (existingCartItem) {
      const updatedCart = cart.map((item) =>
        item.product.id === product.id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      updateCartOnServer(updatedCart);
    } else {
      const updatedCart = [...cart, { product, size, quantity: 1 }];
      setCart(updatedCart);
      updateCartOnServer(updatedCart);
    }
  };

  const handleBuyProduct = async () => {
    try {
      await buyProductWrite({
        args: [product.id, selectedSize, deliveryAddress],
        value: product.price,
      });
      alert("Product purchased successfully!");
    } catch (error) {
      console.error("Error buying product:", error);
      alert("Failed to buy product.");
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
