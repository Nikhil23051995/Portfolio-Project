import React from 'react'; // Import React
import { Link, useNavigate } from 'react-router-dom'; // Import routing components
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { logout } from '../redux/userSlice'; // Import logout action
import MoodFilter from './MoodFilter'; // Import MoodFilter component
import './Header.css'; // Import Header styles

function Header() {
  const { isAuthenticated } = useSelector(state => state.user); // Get auth status
  const dispatch = useDispatch(); // Get dispatch function
  const navigate = useNavigate(); // Get navigate function for routing

  return (
    <div className="header"> {/* Header container */}
      <h1>MoodVibe</h1> {/* App title */}
      <div className="header__nav"> {/* Navigation links/buttons */}
        {isAuthenticated ? ( // Check if user is authenticated
          <>
            <Link to="/">Home</Link> {/* Link to home/feed */}
            <Link to="/profile">Profile</Link> {/* Link to profile */}
            <button onClick={() => { dispatch(logout()); navigate('/login'); }}>Logout</button> {/* Logout button */}
            <MoodFilter /> {/* Mood filter for posts */}
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> {/* Link to login */}
            <Link to="/signup">Sign Up</Link> {/* Link to signup */}
          </>
        )}
      </div>
    </div>
  );
}

export default Header; // Export Header component