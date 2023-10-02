import React, { useState } from "react";
import { useContractWrite } from "wagmi";
import ABI from "../../utils/abi.json";

const UpdateOrderStatus = () => {
  const contractaddress = "0xBba11Ec5cc2e1B04f92457Ac0a7736162EBBFE5A";

  // State for orders
  const [orders, setOrders] = useState([
    {
      id: "",
      status: "",
    },
  ]);

  const statuses = ["Paid", "Shipped", "Delivered", "Returned"]; // Add or modify as needed

  const { write: updateOrderStatusesWrite } = useContractWrite({
    address: contractaddress,
    abi: ABI,
    functionName: "updateOrderStatuses",
  });

  const handleInputChange = (e, index, field) => {
    const newOrders = [...orders];
    newOrders[index][field] = e.target.value;
    setOrders(newOrders);
  };

  const addNewOrder = () => {
    setOrders([...orders, { id: "", status: "" }]);
  };

  const handleUpdateOrderStatuses = async () => {
    const orderIds = orders.map((order) => parseInt(order.id));
    const statuses = orders.map((order) => order.status);
    try {
      await updateOrderStatusesWrite({ args: [orderIds, statuses] });
      console.log("Order statuses updated successfully!");
    } catch (error) {
      console.error("Error updating order statuses:", error);
    }
  };

  return (
    <div className="p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-10">Update Order Statuses</h1>

      <section className="mb-10 p-6 bg-white rounded-lg">
        {orders.map((order, index) => (
          <div key={index} className="mb-8 flex items-center">
            <input
              type="number"
              value={order.id}
              placeholder="Order ID"
              onChange={(e) => handleInputChange(e, index, "id")}
              className="p-2 border rounded-md mr-4"
            />
            <select
              value={order.status}
              onChange={(e) => handleInputChange(e, index, "status")}
              className="p-2 border rounded-md mr-4"
            >
              <option value="" disabled>
                Select Status
              </option>
              {statuses.map((status, sIndex) => (
                <option key={sIndex} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={addNewOrder}
          className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md mr-4"
        >
          Add Another Order
        </button>
        <button
          onClick={handleUpdateOrderStatuses}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
        >
          Update Statuses
        </button>
      </section>
    </div>
  );
};

export default UpdateOrderStatus;
