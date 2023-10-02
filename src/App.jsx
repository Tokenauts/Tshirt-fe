import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Admin from "./components/Admin/Admin";
import Home from "./components/Home";
import GetProduct from "./components/Tshirt/getProduct";
import Product from "./components/Tshirt/Product"; // Import the Product component
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Hero/Footer";
import Cart from "./components/Navbar/Cart";
import Orders from "./components/Orders";
function App() {
  return (
    <Router>
      <div className="bg-slate-900">
        <Navbar />
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Home />} />
          <Route path="/Browse" element={<GetProduct />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />{" "}
          <Route path="/orders" element={<Orders />} />{" "}
        </Routes>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
