
import React from "react";
import useTrafficLight from "./useTrafficLight"; 
import "./App.css"; 
function App() {
  const { light, timer } = useTrafficLight();
  return (
    <div className="App">
      <h2>Traffic Light</h2>
      <div className="traffic-light">
        {["green", "yellow", "red"].map((color) => (
          <div
            key={color}
            className={`light ${color} ${light === color ? "active" : ""}`}
          >
            {light === color && <span>{Math.ceil(timer)}s</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;