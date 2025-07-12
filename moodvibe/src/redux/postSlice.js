import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Import Redux Toolkit

// BACKEND: Fetch posts from backend
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => {
  try {
    // BACKEND: Call posts API
    const response = await fetch('http://localhost:5000/api/posts');
    if (!response.ok) { // Check if response is not OK
      const errorData = await response.json();
      return rejectWithValue(errorData.error); // Return error message
    }
    return await response.json(); // Return posts
  } catch (error) {
    return rejectWithValue('Network error'); // Handle network errors
  }
});

// BACKEND: Create post via backend
export const createPost = createAsyncThunk('posts/createPost', async ({ content, mood, username }, { rejectWithValue }) => {
  try {
    // BACKEND: Get token for auth
    const token = localStorage.getItem('token');
    // BACKEND: Call post creation API
    const response = await fetch('http://localhost:5000/api/posts', {
      method: 'POST', // POST request
      headers: {
        'Content-Type': 'application/json', // JSON content type
        'Authorization': `Bearer ${token}`, // Include token
      },
      body: JSON.stringify({ content, mood, username }), // Send post data
    });
    if (!response.ok) { // Check if response is not OK
      const errorData = await response.json();
      return rejectWithValue(errorData.error); // Return error message
    }
    return await response.json(); // Return created post
  } catch (error) {
    return rejectWithValue('Network error'); // Handle network errors
  }
});

const postSlice = createSlice({ // Create Redux slice for posts
  name: 'posts', // Slice name
  initialState: { // Initial state
    posts: [], // Array of posts
    selectedMood: 'All', // Default mood filter
    error: null, // Error state
  },
  reducers: { // Synchronous reducers
    setMood: (state, action) => { // Set mood filter
      state.selectedMood = action.payload; // Update selected mood
    },
  },
  extraReducers: (builder) => { // Handle async actions
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => { // Fetch posts success
        state.posts = action.payload; // Set posts
        state.error = null; // Clear error
      })
      .addCase(fetchPosts.rejected, (state, action) => { // Fetch posts failure
        state.error = action.payload; // Set error
      })
      .addCase(createPost.fulfilled, (state, action) => { // Create post success
        state.posts.push(action.payload); // Add new post
        state.error = null; // Clear error
      })
      .addCase(createPost.rejected, (state, action) => { // Create post failure
        state.error = action.payload; // Set error
      });
  },
});

export const { setMood } = postSlice.actions; // Export actions
export default postSlice.reducer; // Export reducer