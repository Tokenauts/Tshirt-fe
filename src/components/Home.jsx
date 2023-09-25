import React from "react";
import Navbar from "./Navbar/Navbar";
import Hero from "./Hero/Hero";
import Categories from "./Tshirt/Categories";
import Feature from "./Hero/Feature";
import Faq from "./Hero/Faq";
import Footer from "./Hero/Footer";

const Home = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <Feature />
      <Faq />
    </div>
  );
};

export default Home;
