import { useState } from "react"; /* useEffect */

const Timer = ({ onBack }) => {
  /* 
  const [seconds, setSeconds] = useState(1500); // 25 min
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

 const formatTime = (sec) => `${Math.floor(sec/60)}:${sec % 60 < 10 ? "0" : ""}${sec % 60}`; */

  // minimize app
  const minimizeApp = () => {
      if (window.require) {
          const { ipcRenderer } = window.require('electron');
          // wait for animation
          setTimeout(() => {
              ipcRenderer.send('minimize-app');
          }, 150);
      } else {
          console.warn("Electron IPC não encontrado");
      };
  };

  // close app
  const closeApp = () => {
      // wait for animation
      setTimeout(() => {
          window.close();
      }, 150);
  };

  return (
    <div className="app-container">
      {/* superior bar (draggable) */}
      <div className="flex justify-between items-center mb-6" style={{ WebkitAppRegion: 'drag' }}>
        <div className="main-title">hammy's den &lt;3</div>
        {/* buttons min&close (not draggable) */}
        <div className="flex gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
            <button className="min-close-buttons" onClick={minimizeApp}>_</button>
            <button className="min-close-buttons" onClick={closeApp}>x</button>
        </div>
      </div>
      <div className="base-background"></div>

      <h2 className="page-title">timer</h2>



      {/* "home" button */}
      <div className="flex justify-center">
        <button onClick={onBack} className="button-center1">home</button>
      </div>
    </div>
  );
};

export default Timer;