import React from 'react'; // Import React
import './Post.css'; // Import Post styles

function Post({ post }) { // Post component with post prop
  return (
    <div className="post"> {/* Post container */}
      <div className="post__header"> {/* Post header with avatar and info */}
        <img src={post.userAvatar} alt="Avatar" className="post__avatar" /> {/* User avatar */}
        <div>
          <h3>{post.username}</h3> {/* Username */}
          <p>{post.mood}</p> {/* Post mood */}
        </div>
      </div>
      <p className="post__content">{post.content}</p> {/* Post content */}
      <p className="post__timestamp">{new Date(post.timestamp).toLocaleString()}</p> {/* Post timestamp */}
    </div>
  );
}

export default Post; // Export Post component