import React from "react";
import AddProduct from "./AddProduct";
import UpdateOrderStatus from "./UpdateOrder";
import CardLayout from "./CardLayout";

const Admin = () => {
  return (
    <div>
      <AddProduct />
      <UpdateOrderStatus />
      <CardLayout />
    </div>
  );
};

export default Admin;
