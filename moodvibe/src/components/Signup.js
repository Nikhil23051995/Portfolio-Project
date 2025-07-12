import React, { useState } from 'react'; // Import React and useState
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { signup } from '../redux/userSlice'; // Import signup action
import { useNavigate, Link } from 'react-router-dom'; // Import routing components
import './Signup.css'; // Import Signup styles

function Signup() {
  const [username, setUsername] = useState(''); // State for username input
  const [password, setPassword] = useState(''); // State for password input
  const dispatch = useDispatch(); // Get dispatch function
  const navigate = useNavigate(); // Get navigate function
  const error = useSelector(state => state.user.error); // Get error from Redux

  const handleSignup = async (e) => { // Handle form submission
    e.preventDefault(); // Prevent default form behavior
    try {
      // BACKEND: Dispatch signup action to call backend API
      await dispatch(signup({ username, password })).unwrap();
      navigate('/'); // Redirect to home on success
    } catch (err) {
      // Error handled by Redux state
    }
  };

  return (
    <div className="signup"> {/* Signup form container */}
      <h2>MoodVibe Signup</h2> {/* Form title */}
      <form onSubmit={handleSignup}> {/* Form with submit handler */}
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
        {error && <p className="signup__error">{error}</p>} {/* Display error if present */}
        <button type="submit">Sign Up</button> {/* Submit button */}
      </form>
      <div className="signup__links"> {/* Links container */}
        <Link to="/login">Already have an account? Login</Link> {/* Login link */}
      </div>
    </div>
  );
}

export default Signup; // Export Signup component