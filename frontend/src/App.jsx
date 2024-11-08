import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx"; // Auth context
import { ProductsProvider } from "./context/ProductsContext"; // Import the ProductsProvider
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import "./App.css";
import Profile from "./pages/Profile.jsx";

const App = () => {
  return (
    // Wrap the entire app with both AuthProvider and ProductsProvider
    <AuthProvider>
      <ProductsProvider> {/* Provide the product data globally */}
        <Router>
          <Navbar /> {/* Navbar can now access product data */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </ProductsProvider>
    </AuthProvider>
  );
};

export default App;
