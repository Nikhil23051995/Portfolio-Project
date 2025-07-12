import { configureStore } from '@reduxjs/toolkit'; // Import configureStore
import userReducer from './userSlice'; // Import user reducer
import postReducer from './postSlice'; // Import post reducer

export default configureStore({ // Create Redux store
  reducer: {
    user: userReducer, // Add user reducer
    posts: postReducer, // Add post reducer
  },
});