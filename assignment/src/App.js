import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Product from './components/Product';
import ProductCRUD from './components/ProductCRUD'; // <-- Add this import
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/products" element={<Product />} />
          <Route path="/manage-products" element={<ProductCRUD />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
