import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Import Redux Toolkit

// BACKEND: Async thunk for signup
export const signup = createAsyncThunk('user/signup', async ({ username, password }, { rejectWithValue }) => {
  try {
    // BACKEND: Call signup API
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST', // POST request
      headers: { 'Content-Type': 'application/json' }, // JSON content type
      body: JSON.stringify({ username, password }), // Send username and password
    });
    if (!response.ok) { // Check if response is not OK
      const errorData = await response.json();
      return rejectWithValue(errorData.error); // Return error message
    }
    const data = await response.json(); // Parse response
    // BACKEND: Store JWT token in localStorage
    localStorage.setItem('token', data.token);
    return { username: data.username }; // Return username
  } catch (error) {
    return rejectWithValue('Network error'); // Handle network errors
  }
});

// BACKEND: Async thunk for login
export const login = createAsyncThunk('user/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    // BACKEND: Call login API
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST', // POST request
      headers: { 'Content-Type': 'application/json' }, // JSON content type
      body: JSON.stringify({ username, password }), // Send username and password
    });
    if (!response.ok) { // Check if response is not OK
      const errorData = await response.json();
      return rejectWithValue(errorData.error); // Return error message
    }
    const data = await response.json(); // Parse response
    // BACKEND: Store JWT token in localStorage
    localStorage.setItem('token', data.token);
    return { username: data.username }; // Return username
  } catch (error) {
    return rejectWithValue('Network error'); // Handle network errors
  }
});

// BACKEND: Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async (username, { rejectWithValue }) => {
  try {
    // BACKEND: Call user profile API
    const response = await fetch(`http://localhost:5000/api/users/${username}`);
    if (!response.ok) { // Check if response is not OK
      const errorData = await response.json();
      return rejectWithValue(errorData.error); // Return error message
    }
    return await response.json(); // Return user data
  } catch (error) {
    return rejectWithValue('Network error'); // Handle network errors
  }
});

const userSlice = createSlice({ // Create Redux slice for user
  name: 'user', // Slice name
  initialState: { // Initial state
    profile: { // User profile data
      username: '',
      displayPicture: 'https://via.placeholder.com/100',
      bio: 'Living life one mood at a time!',
      posts: 0,
      followers: [],
      following: [],
    },
    // isAuthenticated:true,  isAuthenticated: !!localStorage.getItem('token'), // BACKEND: Check token for auth
    error: null, // Error state
  },
  reducers: { // Synchronous reducers
    logout: (state) => { // Logout action
      state.profile = { username: '', displayPicture: '', bio: '', posts: 0, followers: [], following: [] }; // Reset profile
      state.isAuthenticated = false; // Set unauthenticated
      state.error = null; // Clear error
      // BACKEND: Remove token on logout
      localStorage.removeItem('token');
    },
    clearError: (state) => { // Clear error action
      state.error = null; // Reset error
    },
  },
  extraReducers: (builder) => { // Handle async actions
    builder
      .addCase(signup.fulfilled, (state, action) => { // Signup success
        state.profile.username = action.payload.username; // Set username
        state.isAuthenticated = true; // Set authenticated
        state.error = null; // Clear error
      })
      .addCase(signup.rejected, (state, action) => { // Signup failure
        state.error = action.payload; // Set error
      })
      .addCase(login.fulfilled, (state, action) => { // Login success
        state.profile.username = action.payload.username; // Set username
        state.isAuthenticated = true; // Set authenticated
        state.error = null; // Clear error
      })
      .addCase(login.rejected, (state, action) => { // Login failure
        state.error = action.payload; // Set error
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => { // Profile fetch success
        state.profile = action.payload; // Update profile
        state.error = null; // Clear error
      })
      .addCase(fetchUserProfile.rejected, (state, action) => { // Profile fetch failure
        state.error = action.payload; // Set error
      });
  },
});

export const { logout, clearError } = userSlice.actions; // Export actions
export default userSlice.reducer; // Export reducer