import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { address, isConnecting, isDisconnected } = useAccount();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/getOrdersByUser/${address}`
        );
        let data = await response.json();

        if (!Array.isArray(data)) {
          data = [];
        }

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="p-4 bg-slate-800 shadow-lg rounded-md">
            <div className="flex justify-between items-center mb-4">
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
                          {product.fileType.includes("video") && (
                            <video
                              width="320"
                              height="180"
                              muted
                              autoPlay
                              loop
                              className="mt-2"
                            >
                              <source
                                src={
                                  product.fileHash[
                                    product.fileType.indexOf("video")
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
    </div>
  );
};

export default Orders;
