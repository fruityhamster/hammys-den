import { useState, useEffect } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(1500); // 25 min
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (sec) => `${Math.floor(sec/60)}:${sec % 60 < 10 ? "0" : ""}${sec % 60}`;

  return (
    <div>
      <h2>Timer</h2>
      <h1>{formatTime(seconds)}</h1>
      <button onClick={() => setRunning(!running)}>{running ? "Pause" : "Start"}</button>
      <button onClick={() => setSeconds(1500)}>Reset</button>
    </div>
  );
}

export default Timer;