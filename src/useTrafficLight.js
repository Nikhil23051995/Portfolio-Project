
import { useEffect, useState } from "react";

const durations = {
  green: 3,
  yellow: 0.5,
  red: 4,
};

const sequence = ["green", "yellow", "red"];

function useTrafficLight() {
  const [light, setLight] = useState("green");
  const [timer, setTimer] = useState(durations["green"]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      const next = sequence[(sequence.indexOf(light) + 1) % sequence.length];
      setLight(next);
      setTimer(durations[next]);
    }, durations[light] * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [light]);

  return { light, timer };
}

export default useTrafficLight;