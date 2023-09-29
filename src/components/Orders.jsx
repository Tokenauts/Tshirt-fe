import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { address, isConnecting, isDisconnected } = useAccount();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `https://cooperative-shoulder-pads-colt.cyclic.cloud/getOrdersByUser/${address}`
        );
        let data = await response.json();
        console.log(data);
        if (!Array.isArray(data)) {
          data = [];
        }
        data.sort((a, b) => b.id - a.id);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (address) {
      fetchOrders();
    }
  }, [address]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-4">
        {currentOrders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-slate-900 shadow-lg rounded-md  "
          >
            <div className="flex justify-between items-center mb-4 border-black">
              <h2 className="text-2xl font-semibold text-slate-200">
                Order #{order.id}
              </h2>
              <span
                className={`px-2 py-1 rounded ${
                  order.status === "Paid"
                    ? "bg-green-500 text-slate-900"
                    : "bg-slate-600 text-slate-200"
                } `}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between">
                <strong>Buyer:</strong>
                <span>{order.buyer}</span>
              </div>

              <div>
                <strong>Products:</strong>
                <ul className="space-y-2">
                  {order.products
                    .reduce((uniqueProducts, product, index) => {
                      const existingProduct = uniqueProducts.find(
                        (up) => up.id === product.id
                      );
                      if (existingProduct) {
                        existingProduct.sizes.push(order.sizes[index]);
                        existingProduct.quantities.push(
                          order.quantities[index]
                        );
                      } else {
                        uniqueProducts.push({
                          ...product,
                          sizes: [order.sizes[index]],
                          quantities: [order.quantities[index]],
                        });
                      }
                      return uniqueProducts;
                    }, [])
                    .map((product) => (
                      <li
                        key={product.id}
                        className="border-t border-slate-700 pt-2"
                      >
                        <div className="flex justify-between">
                          <span>{product.name}</span>
                          <span>
                            Sizes: {product.sizes.join(", ")} (Quantities:{" "}
                            {product.quantities.join(", ")})
                          </span>
                        </div>
                        <div className="mt-2">
                          {product.fileTypes.includes("video") && (
                            <video
                              width="320"
                              height="180"
                              muted
                              autoPlay
                              loop
                              className="mt-2"
                              lazy
                            >
                              <source
                                src={
                                  product.fileHashes[
                                    product.fileTypes.indexOf("video")
                                  ]
                                }
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="flex justify-between">
                <strong>Delivery Address:</strong>
                <span>{order.deliveryAddress}</span>
              </div>

              <div className="flex justify-between">
                <strong>Tracking Link:</strong>
                <span>{order.trackingLink}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination flex justify-center items-center mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-l-md focus:outline-none focus:border-slate-600 focus:ring focus:ring-slate-200 focus:ring-opacity-50 w-24 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-slate-700 text-slate-200 border border-slate-800">
          Page {currentPage}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`px-4 py-2 text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-r-md focus:outline-none focus:border-slate-600 focus:ring focus:ring-slate-200 focus:ring-opacity-50 w-24 ${
            currentPage * 5 >= orders.length
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={currentPage * 5 >= orders.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
