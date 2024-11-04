import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Assuming you have an auth context for token management
import "../styles/Admin.css";

const Admin = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: ''
  });
  const [editProductId, setEditProductId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError("You must be logged in as an admin to view this page.");
        setLoading(false);
        return;
      }
      try {
        const [productsResponse, usersResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/admin/products", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get("http://localhost:3000/api/admin/users", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);
        console.log(productsResponse.data.products);
        setProducts(productsResponse.data.products);
        setUsers(usersResponse.data.users);
      } catch (err) {
        setError(
          err.response ? err.response.data.error : "Error fetching data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAddProduct = async () => {
    if (!user) return;

    try {
      await axios.post(
        "http://localhost:3000/api/admin/products",
        newProduct,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setProducts((prev) => [...prev, newProduct]);
      setNewProduct({ name: '', description: '', price: '', category_id: '', image_url: '' });
    } catch (err) {
      setError("Error adding product: " + (err.response ? err.response.data.error : err.message));
    }
  };

  const handleEditProduct = async (id) => {
    if (!user) return;

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
          product.id === id ? response.data : product
        )
      );
      setEditProductId(null);
      setNewProduct({ name: '', description: '', price: '', category_id: '', image_url: '' });
    } catch (err) {
      setError("Error updating product: " + (err.response ? err.response.data.error : err.message));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!user) return;

    try {
      await axios.delete(`http://localhost:3000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      setError("Error deleting product: " + (err.response ? err.response.data.error : err.message));
    }
  };

  if (loading) return <p className="admin-loading">Loading...</p>;
  if (error) return <p className="admin-error">{error}</p>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <h2>Products</h2>
      <div>
        <h3>{editProductId ? 'Edit Product' : 'Add Product'}</h3>
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
        {editProductId ? (
          <button onClick={() => handleEditProduct(editProductId)}>Update Product</button>
        ) : (
          <button onClick={handleAddProduct}>Add Product</button>
        )}
      </div>

      <ul className="admin-product-list">
        {products.map((product) => (
          <li key={product.id} className="admin-product-item">
            {product.name} - {product.price} USD
            <button onClick={() => { setEditProductId(product.id); setNewProduct(product); }}>Edit</button>
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Users</h2>
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
