import React from 'react'; // Import React
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { setMood } from '../redux/postSlice'; // Import setMood action
import './MoodFilter.css'; // Import MoodFilter styles

function MoodFilter() {
  const selectedMood = useSelector(state => state.posts.selectedMood); // Get selected mood
  const dispatch = useDispatch(); // Get dispatch function

  return (
    <div className="mood-filter"> {/* Mood filter container */}
      <select
        value={selectedMood} // Bind to selected mood
        onChange={(e) => dispatch(setMood(e.target.value))} // Update mood on change
      >
        <option value="All">All Moods</option> {/* All moods option */}
        <option value="Happy">Happy</option> {/* Happy mood option */}
        <option value="Sad">Sad</option> {/* Sad mood option */}
        <option value="Excited">Excited</option> {/* Excited mood option */}
        <option value="Angry">Angry</option> {/* Angry mood option */}
      </select>
    </div>
  );
}

export default MoodFilter; // Export MoodFilter component