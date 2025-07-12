import React, { useState } from 'react'; // Import React and useState for form state
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { login } from '../redux/userSlice'; // Import login action
import { useNavigate, Link } from 'react-router-dom'; // Import routing components
import './Login.css'; // Import Login styles

function Login() {
  const [username, setUsername] = useState(''); // State for username input
  const [password, setPassword] = useState(''); // State for password input
  const dispatch = useDispatch(); // Get dispatch function
  const navigate = useNavigate(); // Get navigate function
  const error = useSelector(state => state.user.error); // Get error from Redux

  const handleLogin = async (e) => { // Handle form submission
    e.preventDefault(); // Prevent default form behavior
    try {
      // BACKEND: Dispatch login action to call backend API
      await dispatch(login({ username, password })).unwrap();
      navigate('/'); // Redirect to home on success
    } catch (err) {
      // Error handled by Redux state
    }
  };

  return (
    <div className="login"> {/* Login form container */}
      <h2>MoodVibe Login</h2> {/* Form title */}
      <form onSubmit={handleLogin}> {/* Form with submit handler */}
        <input
          type="text"
          placeholder="Username"
          value={username} // Bind input to state
          onChange={(e) => setUsername(e.target.value)} // Update state on change
        />
        <input
          type="password"
          placeholder="Password"
          value={password} // Bind input to state
          onChange={(e) => setPassword(e.target.value)} // Update state on change
        />
        {error && <p className="login__error">{error}</p>} {/* Display error if present */}
        <button type="submit">Login</button> {/* Submit button */}
      </form>
      <div className="login__links"> {/* Links container */}
        <Link to="/signup">Don't have an account? Sign Up</Link> {/* Signup link */}
        <Link to="/forgot-password">Forgot Password?</Link> {/* Forgot password link */}
      </div>
    </div>
  );
}

export default Login; // Export Login component