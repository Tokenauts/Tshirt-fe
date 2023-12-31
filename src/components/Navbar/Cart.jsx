import React, { useState, useEffect } from "react";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import ABI from "../../utils/abi.json";
import { useAccount } from "wagmi";
import Notification from "./Notification";
const contractaddress = "0xBba11Ec5cc2e1B04f92457Ac0a7736162EBBFE5A";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../loading";
const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const { address, isConnecting, isDisconnected } = useAccount();
  const [step, setStep] = useState(1);
  const [transactionHash, setTransactionHash] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true); // New state for cart loading
  const [isTransactionLoading, setIsTransactionLoading] = useState(false); // New state for transaction loading

  const { data, write: buyProductsWrite } = useContractWrite({
    address: contractaddress,
    abi: ABI,
    functionName: "buyProducts",
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const updateOrdersForUser = async () => {
    try {
      const response = await fetch(
        `https://cooperative-shoulder-pads-colt.cyclic.cloud/updateOrderForUser/${address}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Orders updated successfully:", data);
      } else {
        console.log(
          "Failed to update orders for user. HTTP Status:",
          response.status
        );
      }
    } catch (err) {
      console.error("Failed to update orders for user:", err);
    }
  };
  const clearCart = async (userId) => {
    try {
      const response = await fetch(
        `https://cooperative-shoulder-pads-colt.cyclic.cloud/clearCart/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Cart cleared:", data);
        const event = new Event("cartUpdated");
        window.dispatchEvent(event);
      } else {
        console.log("Failed to clear cart:", response.status);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTransactionComplete(true); // Set transaction to complete upon success

      setShowNotification(true);

      updateOrdersForUser().then(() => {
        console.log("Order list updated!");
      });
      clearCart(address);
    }
  }, [isLoading, isSuccess]);

  const fetchCartFromServer = async () => {
    try {
      setIsCartLoading(true); // Set cart loading to true before fetching

      const response = await fetch(
        `https://cooperative-shoulder-pads-colt.cyclic.cloud/getcart/${address}`
      );
      const serverCart = await response.json();
      setCart(serverCart);
    } catch (error) {
      console.error("Error fetching cart from server:", error);
    } finally {
      setIsCartLoading(false); // Set cart loading to false once done
    }
  };

  const updateQuantity = async (productId, selectedSize, change = 1) => {
    // Step 1: Identify the cart item
    const cartItem = cart.items.find(
      (item) => item.productId === productId && item.size === selectedSize
    );

    if (!cartItem) return; // exit if the item isn't found

    // Step 2: Update quantity locally (you could do this after the server updates, depending on your needs)
    cartItem.quantity += change;

    // Step 3: Update the server
    const userId = address; // Assuming the wallet address is the user ID
    const Tprice = cartItem.price.toString(); // Convert price to a string if it isn't already

    try {
      const response = await fetch(
        "https://cooperative-shoulder-pads-colt.cyclic.cloud/updatecart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId,
            quantity: cartItem.quantity,
            size: selectedSize,
            fileHash: cartItem.fileHash, // Assuming each cart item has a fileHash property
            name: cartItem.name,
            price: Tprice,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCart(data);
        const event = new Event("cartUpdated");
        window.dispatchEvent(event);
      } else {
        console.log("Failed to update cart. HTTP Status:", response.status);
      }
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  useEffect(() => {
    fetchCartFromServer();
  }, []);

  const totalCost = cart.items.reduce(
    (total, item) => total + parseInt(item.price || 0) * item.quantity,
    0
  );

  const handleBuyProducts = async () => {
    try {
      setIsTransactionLoading(true); // Set transaction loading to true before initiating transaction

      const productIds = cart.items.map((item) => item.productId);
      const sizes = cart.items.map((item) => item.size);
      const quantities = cart.items.map((item) => item.quantity);

      const tx = await buyProductsWrite({
        args: [productIds, sizes, quantities, deliveryAddress],
        value: totalCost,
      });

      // Set transaction hash to state
      setTransactionHash(tx?.transactionHash);
    } catch (error) {
      console.error("Error buying products:", error);
      alert("Failed to buy products.");
    } finally {
      setIsTransactionLoading(false); // Set transaction loading to false once transaction is done
    }
  };
  if (isCartLoading) {
    return <Loading />; // Show the Loading component while cart data is being fetched
  }

  if (transactionComplete) {
    return (
      <div className="flex flex-col items-center justify-center max-w-screen-lg mx-auto p-8 min-h-screen bg-slate-900">
        {showNotification && (
          <div className="fixed top-0 right-0 z-50">
            <AnimatePresence>
              <Notification
                message="Successfully Purchased!"
                subMessage={
                  <a
                    href={`https://mumbai.polygonscan.com/tx/${data.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View your transaction
                  </a>
                }
                color="#44C997"
                onClose={() => setShowNotification(false)}
              />
            </AnimatePresence>
          </div>
        )}

        <div className="text-center">
          <h1 className="text-4xl mb-6 font-bold">Transaction Successful!</h1>
          <p className="text-2xl mb-4">Thank you for your purchase!</p>
        </div>

        <div className="w-full p-8 rounded-md bg-white text-black shadow-lg">
          <h2 className="text-xl mb-4 font-medium">Order Details:</h2>
          <p>
            <strong>Delivery Address:</strong> {deliveryAddress}
          </p>
          <p>
            <strong>Total Cost:</strong> ${totalCost.toFixed(2)}
          </p>
          <p>
            <strong>Estimated Delivery Time:</strong> 3-5 business days
          </p>
          <ul className="list-disc list-inside mt-4">
            {cart.items.map((item, idx) => (
              <li key={idx}>
                {item.name} - {item.size} (Quantity: {item.quantity})
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <a href="/Browse" className="text-blue-400 hover:text-blue-600">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col max-w-screen-lg mx-auto p-8 text-gray-50 min-h-screen">
        <h1 className="text-3xl mb-6">Your Cart</h1>
        {cart.items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="grid grid-cols-5 gap-4 mb-6 text-sm font-medium text-gray-600">
              <span>Product</span>
              <span>Name</span>
              <span>Size</span>
              <span>Quantity</span>
              <span>Price</span>
            </div>
            {cart.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-5 gap-4 py-4 border-b">
                <div className="flex items-center">
                  <video
                    src={item.fileHash}
                    className="h-36 " // I've adjusted the width and height here
                    autoPlay
                    muted
                    loop
                  ></video>
                </div>
                <div className="flex items-center">
                  <span className="ml-4">{item.name}</span>
                </div>
                <div className="flex items-center">{item.size}</div>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.size, -1)
                    }
                    className="px-2 py-1 border rounded-l-md"
                  >
                    -
                  </button>
                  <span className="border-t border-b px-3 py-1">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.size, 1)}
                    className="px-2 py-1 border rounded-r-md"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center">${item.price}</div>
                <div className="flex items-center">
                  {/* Add actions like remove item here */}
                </div>
              </div>
            ))}

            <div className="mt-8 text-right text-2xl">
              <strong>Total: </strong>${totalCost.toFixed(2)}
            </div>

            <div className="mt-8">
              <label className="block mb-2 text-lg font-medium ">
                Enter your delivery address:
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="w-full p-2 border rounded-md text-black"
              />
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleBuyProducts}
                className="w-40 p-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
