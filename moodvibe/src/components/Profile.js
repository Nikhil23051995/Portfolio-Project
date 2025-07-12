import React, { useState, useEffect } from 'react'; // Import React, useState, useEffect
import { useSelector, useDispatch } from 'react-redux'; // Import Redux hooks
import { createPost, fetchPosts } from '../redux/postSlice'; // Import post actions
import { fetchUserProfile } from '../redux/userSlice'; // BACKEND: Import fetchUserProfile action
import Post from './Post'; // Import Post component
import './Profile.css'; // Import Profile styles

function Profile() {
  const { profile } = useSelector(state => state.user); // Get user profile from Redux
  const posts = useSelector(state => state.posts.posts); // Get posts from Redux
  const userPosts = posts.filter(post => post.username === profile.username); // Filter posts by user
  const [content, setContent] = useState(''); // State for post content
  const [mood, setMood] = useState('Happy'); // State for post mood
  const dispatch = useDispatch(); // Get dispatch function

  // BACKEND: Fetch user profile and posts on component mount
  useEffect(() => {
    dispatch(fetchUserProfile(profile.username)); // Fetch user data
    dispatch(fetchPosts()); // Fetch all posts
  }, [dispatch, profile.username]); // Dependencies: dispatch, username

  const handlePost = async (e) => { // Handle post creation
    e.preventDefault(); // Prevent default form behavior
    if (content.trim()) { // Check if content is not empty
      await dispatch(createPost({ content, mood, username: profile.username })); // Dispatch post creation
      setContent(''); // Clear content input
    }
  };

  // BACKEND: Follow another user
  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token'); // Get JWT token
      const response = await fetch(`http://localhost:5000/api/users/follow/${profile._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token for auth
        },
      });
      if (!response.ok) throw new Error('Failed to follow'); // Check response
      dispatch(fetchUserProfile(profile.username)); // Refresh profile data
    } catch (error) {
      console.error('Follow error:', error); // Log error
    }
  };

  // BACKEND: Unfollow a user
  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem('token'); // Get JWT token
      const response = await fetch(`http://localhost:5000/api/users/unfollow/${profile._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token for auth
        },
      });
      if (!response.ok) throw new Error('Failed to unfollow'); // Check response
      dispatch(fetchUserProfile(profile.username)); // Refresh profile data
    } catch (error) {
      console.error('Unfollow error:', error); // Log error
    }
  };

  return (
    <div className="profile"> {/* Profile container */}
      <div className="profile__header"> {/* Profile header */}
        <img src={profile.displayPicture} alt="Avatar" className="profile__avatar" /> {/* User avatar */}
        <div className="profile__info"> {/* User info */}
          <h2>{profile.username}</h2> {/* Username */}
          <p>{profile.bio}</p> {/* Bio */}
          <div className="profile__stats"> {/* Stats container */}
            <span>{userPosts.length} Posts</span> {/* Post count */}
            <span>{profile.followers?.length || 0} Followers</span> {/* Followers count */}
            <span>{profile.following?.length || 0} Following</span> {/* Following count */}
          </div>
          <div className="profile__actions"> {/* Action buttons */}
            <button onClick={handleFollow}>Follow</button> {/* Follow button */}
            <button onClick={handleUnfollow}>Unfollow</button> {/* Unfollow button */}
          </div>
        </div>
      </div>
      <div className="profile__post-form"> {/* Post creation form */}
        <form onSubmit={handlePost}> {/* Form with submit handler */}
          <textarea
            placeholder="What's on your mind?"
            value={content} // Bind to content state
            onChange={(e) => setContent(e.target.value)} // Update content state
          />
          <select value={mood} onChange={(e) => setMood(e.target.value)}> {/* Mood selector */}
            <option value="Happy">Happy</option>
            <option value="Sad">Sad</option>
            <option value="Excited">Excited</option>
            <option value="Angry">Angry</option>
          </select>
          <button type="submit">Post</button> {/* Submit button */}
        </form>
      </div>
      <div className="profile__posts"> {/* User posts container */}
        {userPosts.length > 0 ? ( // Check if user has posts
          userPosts.map(post => <Post key={post.id} post={post} />) // Render posts
        ) : (
          <p>No posts yet. Share your mood!</p> // Fallback message
        )}
      </div>
    </div>
  );
}

export default Profile; // Export Profile component