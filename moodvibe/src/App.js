import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import Post from './components/Post';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import { clearError } from './redux/userSlice';
import './App.css';

function App() {
  const posts = useSelector(state => state.posts.posts);
  const selectedMood = useSelector(state => state.posts.selectedMood);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const dispatch = useDispatch();
  const filteredPosts = selectedMood === 'All' ? posts : posts.filter(post => post.mood === selectedMood);

  useEffect(() => {
    dispatch(clearError()); // Clear errors on route change
  }, [dispatch]);

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div className="app__body">
                <div className="app__feed">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => <Post key={post.id} post={post} />)
                  ) : (
                    <p>No posts available for {selectedMood === 'All' ? 'any mood' : selectedMood}. Try another mood!</p>
                  )}
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/forgot-password"
          element={<div className="forgot-password">Forgot Password? (Feature coming soon)</div>}
        />
      </Routes>
    </div>
  );
}

export default App;