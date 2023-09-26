import React, { useState, useEffect } from "react";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import ABI from "../../utils/abi.json";
import { useAccount } from "wagmi";
const contractaddress = "0x6edA69F4367deD9221aF2d96ADbEb52b139e9aCE";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const { address, isConnecting, isDisconnected } = useAccount();
  const [step, setStep] = useState(1);

  const { write: buyProductsWrite } = useContractWrite({
    address: contractaddress,
    abi: ABI,
    functionName: "buyProducts",
  });

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleBuyProducts();
    }
  };
  const handlePreviousStep = () => {
    if (step < 4) {
      setStep(step - 1);
    }
  };
  const fetchCartFromServer = async () => {
    try {
      const response = await fetch(
        `https://cooperative-shoulder-pads-colt.cyclic.cloud/getcart/${address}`
      );
      const serverCart = await response.json();
      setCart(serverCart);
    } catch (error) {
      console.error("Error fetching cart from server:", error);
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
      const productIds = cart.map((item) => item.product.id);
      const sizes = cart.map((item) => item.size);
      const quantities = cart.map((item) => item.quantity);

      await buyProductsWrite({
        args: [productIds, sizes, quantities, deliveryAddress],
        value: totalCost,
      });

      alert("Products purchased successfully!");
      setCart([]); // Clear the cart after purchase
      updateCartOnServer([]);
    } catch (error) {
      console.error("Error buying products:", error);
      alert("Failed to buy products.");
    }
  };

  return (
    <div className="flex p-12  max-w-7xl mx-auto">
      <div className="flex-1 p-6 rounded-lg">
        {/* Steps Navigation */}
        <section>
          <div className="items-center px-8 py-12 mx-auto max-w-7xl lg:px-16 md:px-12 lg:py-24">
            <div className="justify-center w-full mx-auto">
              <nav aria-label="Progress">
                <ol
                  role="list"
                  className="flex items-center justify-center mx-auto"
                >
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <li key={idx} className="relative pr-8 sm:pr-20">
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div
                          className={`h-0.5 w-full ${
                            step > idx + 1 ? "bg-black" : "bg-gray-200"
                          }`}
                        ></div>
                      </div>
                      <a
                        href="#"
                        className={`relative flex items-center justify-center w-8 h-8 ${
                          step === idx + 1
                            ? "bg-white border-2 border-black"
                            : "bg-black"
                        } rounded-full`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            step === idx + 1 ? "bg-black" : "bg-transparent"
                          }`}
                          aria-hidden="true"
                        ></span>
                        <span className="sr-only">{`Step ${idx + 1}`}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </div>
        </section>

        {/* Step 1: Show the cart */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {cart.items.map((item, index) => (
              <div key={index} className="flex mb-4 p-4 border rounded-lg">
                <video
                  src={item.fileHash}
                  className="w-1/4 object-cover rounded-lg"
                  autoPlay
                  muted
                  loop
                ></video>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>

                  <p className="text-gray-600">Size: {item.size}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, -1)
                      }
                      className="border px-2 py-1 rounded-l-md"
                    >
                      -
                    </button>
                    <span className="border-t border-b px-3 py-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, 1)
                      }
                      className="border px-2 py-1 rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {cart.items.length === 0 && <p>Your cart is empty.</p>}
            <div className="mt-6 text-right">
              <p className="text-xl">Total Cost: ${totalCost.toFixed(2)}</p>
            </div>
          </>
        )}

        {/* Step 2: Handle Delivery Address */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>
            <label className="block mb-2 text-lg font-medium">
              Enter your delivery address:
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your delivery address"
              className="w-full p-2 border rounded-md"
            />
          </>
        )}

        {/* Step 3: Overview & Place Order */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            {/* ... (display the cart contents in a brief format) */}
            <button
              onClick={handleBuyProducts}
              className="w-40 p-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Place Order
            </button>
          </>
        )}

        {/* Next Step Button (if not on the last step) */}
        {step < 3 && (
          <button
            onClick={handleNextStep}
            className="w-40 p-4 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Next
          </button>
        )}

        {step > 1 && (
          <button
            onClick={handlePreviousStep}
            className="w-40 ml-12 p-4 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;
