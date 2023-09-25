"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { address, isConnecting, isDisconnected } = useAccount();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchCartData = async () => {
      const response = await fetch(`http://localhost:3001/getCart/${address}`);
      const cartData = await response.json();

      const totalItems = cartData.reduce(
        (accum, item) => accum + item.quantity,
        0
      );
      setCartItemCount(totalItems);
    };

    fetchCartData();
    const handleCartUpdate = () => {
      fetchCartData();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <div className="w-full mx-auto 2xl:max-w-7xl relative z-50 rounded-xl max-w-7xl">
      <div className="relative flex flex-col w-full p-5 mx-auto md:items-center md:justify-between md:flex-row md:space-x-6 lg:px-8">
        <div className="flex flex-row items-center justify-between lg:justify-start">
          <a
            className="text-lg tracking-tight text-black uppercase focus:outline-none focus:ring lg:text-2xl"
            href="/"
          >
            <img src="/Logo.png" className="h-8" alt="Logo" />
          </a>
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-black focus:outline-none focus:text-black md:hidden"
          >
            <svg
              className="w-6 h-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              )}
            </svg>
          </button>
        </div>
        <nav
          className={`${
            isOpen ? "flex" : "hidden"
          } flex-col items-center flex-grow md:pb-0 md:flex md:justify-end md:flex-row md:space-x-4`}
        >
          <a
            className="px-2 py-2 text-sm text-gray-500 lg:px-6 md:px-3 hover:text-gray-50"
            href="#"
          >
            Our Story
          </a>
          <a
            className="px-2 py-2 text-sm text-gray-500 lg:px-6 md:px-3 hover:text-gray-50"
            href="#"
          >
            Browse
          </a>
          <a
            className="px-2 py-2 text-sm text-gray-500 lg:px-6 md:px-3 hover:text-gray-50"
            href="#"
          >
            Contract
          </a>
          <div className="flex items-center space-x-6">
            <ConnectButton />
            <Link to="./Cart">
              <div className="relative py-2">
                <div className="absolute top-0 left-3">
                  <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">
                    {cartItemCount}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="white"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </div>
            </Link>
            <Link to="/orders">
              <img src="/orders.svg" alt="Orders Icon" className="h-8" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
