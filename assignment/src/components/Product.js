import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../redux/productSlice';

const ProductCRUD = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [newProduct, setNewProduct] = useState({ title: '', price: '', category: '' });
  const [editProduct, setEditProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price || !newProduct.category) {
      alert('Please fill in all fields');
      return;
    }
    dispatch(addProduct({ ...newProduct, price: parseFloat(newProduct.price) }))
      .then(() => setSuccessMessage('Product added successfully!'))
      .catch(() => setSuccessMessage(''));
    setNewProduct({ title: '', price: '', category: '' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editProduct.title || !editProduct.price || !editProduct.category) {
      alert('Please fill in all fields');
      return;
    }
    dispatch(updateProduct({ id: editProduct.id, ...editProduct, price: parseFloat(editProduct.price) }))
      .then(() => setSuccessMessage('Product updated successfully!'))
      .catch(() => setSuccessMessage(''));
    setEditProduct(null);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id))
        .then(() => setSuccessMessage('Product deleted successfully!'))
        .catch(() => setSuccessMessage(''));
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h2 style={{ marginBottom: '20px' }}>🛒 Product Management</h2>
      <h4>Total Products: {products.length}</h4>
      {successMessage && <p style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

      {/* Add Form */}
      <form onSubmit={handleAdd} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.title}
          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
          style={{ padding: '8px', width: '200px' }}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          style={{ padding: '8px', width: '100px' }}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          style={{ padding: '8px', width: '150px' }}
          required
        />
        <button
          type="submit"
          style={{ padding: '8px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none' }}
        >
          Add
        </button>
      </form>

      {/* Edit Form */}
      {editProduct && (
        <form onSubmit={handleUpdate} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={editProduct.title}
            onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
            style={{ padding: '8px', width: '200px' }}
            required
          />
          <input
            type="number"
            value={editProduct.price}
            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
            style={{ padding: '8px', width: '100px' }}
            required
          />
          <input
            type="text"
            value={editProduct.category}
            onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
            style={{ padding: '8px', width: '150px' }}
            required
          />
          <button
            type="submit"
            style={{ padding: '8px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => setEditProduct(null)}
            style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none' }}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Product Table */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>ID</th>
              <th>Name</th>
              <th>Price ($)</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.title}</td>
                <td>{p.price}</td>
                <td>{p.category}</td>
                <td>
                  <button
                    onClick={() => setEditProduct(p)}
                    style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ padding: '5px 10px', backgroundColor: 'red', color: '#fff', border: 'none' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductCRUD;