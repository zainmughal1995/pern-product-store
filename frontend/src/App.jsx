import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Product from "./pages/Product";

const App = () => {
  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>
    </div>
  );
};

export default App;
