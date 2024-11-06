import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Access user authentication context
import "../styles/Admin.css"; // Import styling for the admin dashboard

const Admin = () => {
  const { user } = useAuth(); // Get the current user from the AuthContext
  const [products, setProducts] = useState([]); // State for product list
  const [users, setUsers] = useState([]); // State for users list
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error messages
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: ''
  }); // State for handling new/edited product data
  const [editProductId, setEditProductId] = useState(null); // State to track the product being edited

  useEffect(() => {
    // Fetch products and users data when the component mounts
    const fetchData = async () => {
      if (!user) {
        setError("You must be logged in as an admin to view this page.");
        setLoading(false);
        return;
      }
      try {
        // Fetch products and users in parallel using Promise.all
        const [productsResponse, usersResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/admin/products", {
            headers: { Authorization: `Bearer ${user.token}` }, // Pass token in headers
          }),
          axios.get("http://localhost:3000/api/admin/users", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);
        setProducts(productsResponse.data.products); // Set products data from response
        setUsers(usersResponse.data.users); // Set users data from response
      } catch (err) {
        setError(err.response ? err.response.data.error : "Error fetching data");
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchData();
  }, [user]); // Re-run when the user changes (e.g., when logged in/out)

  // Handle adding a new product
  const handleAddProduct = async () => {
    if (!user) return; // Ensure user is logged in

    try {
      // Send POST request to add the new product
      await axios.post(
        "http://localhost:3000/api/admin/products",
        newProduct,
        {
          headers: { Authorization: `Bearer ${user.token}` }, // Pass token in headers
        }
      );
      setProducts((prev) => [...prev, newProduct]); // Add new product to state
      setNewProduct({ name: '', description: '', price: '', category_id: '', image_url: '' }); // Clear the form
    } catch (err) {
      setError("Error adding product: " + (err.response ? err.response.data.error : err.message));
    }
  };

  // Handle editing an existing product
  const handleEditProduct = async (id) => {
    if (!user) return; // Ensure user is logged in

    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/products/${id}`,
        newProduct,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? response.data : product // Update the product in state
        )
      );
      setEditProductId(null); // Clear the edit mode
      setNewProduct({ name: '', description: '', price: '', category_id: '', image_url: '' }); // Reset form
    } catch (err) {
      setError("Error updating product: " + (err.response ? err.response.data.error : err.message));
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async (id) => {
    if (!user) return; // Ensure user is logged in

    try {
      // Send DELETE request to remove the product
      await axios.delete(`http://localhost:3000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts((prev) => prev.filter((product) => product.id !== id)); // Remove product from state
    } catch (err) {
      setError("Error deleting product: " + (err.response ? err.response.data.error : err.message));
    }
  };

  // Show loading or error message while fetching data
  if (loading) return <p className="admin-loading">Loading...</p>;
  if (error) return <p className="admin-error">{error}</p>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <h2>Products</h2>
      <div>
        <h3>{editProductId ? 'Edit Product' : 'Add Product'}</h3>
        {/* Product input fields */}
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category ID"
          value={newProduct.category_id}
          onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.image_url}
          onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
        />
        {/* Button for adding or updating a product */}
        {editProductId ? (
          <button onClick={() => handleEditProduct(editProductId)}>Update Product</button>
        ) : (
          <button onClick={handleAddProduct}>Add Product</button>
        )}
      </div>

      {/* List of products */}
      <ul className="admin-product-list">
        {products.map((product) => (
          <li key={product.id} className="admin-product-item">
            {product.name} - {product.price} USD
            {/* Buttons for editing and deleting a product */}
            <button onClick={() => { setEditProductId(product.id); setNewProduct(product); }}>Edit</button>
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Users</h2>
      {/* List of users */}
      <ul className="admin-user-list">
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email} - Joined on {new Date(user.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
