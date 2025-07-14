import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    console.log('Sending login:', { username: email, password });

    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username: email, // DummyJSON uses 'username' field
        password,
      });

      const { token, username } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username }));
      dispatch(loginSuccess({ username }));
      navigate('/products');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Username (e.g., kminchelle)"
          required
          style={{ display: 'block', margin: '10px 0' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (e.g., 0lelplR)"
          required
          style={{ display: 'block', margin: '10px 0' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '5px 10px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
      <p>Test credentials: username: emilys, password: emilyspass</p>
    </div>
  );
};

export default Login;