import { useState, useEffect } from "react";
/* import recipes images */
import bubble_tea from '../assets/timer-bubble-tea.png'; 
import sushi from '../assets/timer-sushi.png';
import blueberry_cake from '../assets/timer-blueberry-cake.png';
import pancakes from '../assets/timer-pancakes.png';

const Timer = ({ onBack }) => {
  
  // recipes images (add here for future images)
  const recipes = [
  { id: 1, name: 'bubble_tea', img: bubble_tea },
  { id: 2, name: 'sushi', img: sushi },
  { id: 3, name: 'blueberry_cake', img: blueberry_cake },
  { id: 4, name: 'pancakes', img: pancakes },
  ];

  const [step, setStep] = useState('recipes');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0); // all secounds
  const [isActive, setIsActive] = useState(false); // counting or paused
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const [endDate, setEndDate] = useState('');

  // function called when cliking on the food
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setStep('select-time');
  };
  
  // convert minutes to seconds
  const handleConfirmTime = () => {
    if (!selectedTime) return;
    setSecondsLeft(selectedTime * 60);
    setStep('countdown');
  };

  // if timer is active: -1sec
  useEffect(() => {
    let interval = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((seconds) => seconds - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      clearInterval(interval);

      // Captura a data atual e formata como DD-MM-AAAA
      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
      
      setEndDate(formattedDate);
      setStep('finished');
    }

    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

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

      {/* 1 - recipes */}
      {step === 'recipes' && (
        <>
          <h2 className="page-title">cooking recipes</h2>

          {/* recipes buttons */}
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <button key={recipe.id} className="recipe-card" onClick={() => { handleRecipeClick(recipe) }}>
                <img src={recipe.img} alt="" draggable="false"/>
              </button>
            ))}
          </div>

          {/* "home" button */}
          <div className="flex justify-center">
            <button onClick={onBack} className="button-center1">home</button>
          </div>
        </>
      )}
      {/* 2 - select time/minutes */}
      {step === 'select-time' && (
        <>
          <h2 className="page-title">select timer</h2>
          <h3 className="page-subtitle">minutes</h3>

          <div className="time-picker-container">
            {/* numbers list with scroll */}
            <div className="time-list">
              {[...Array(60)].map((_, i) => (
              <div 
                key={i+1} 
                className={`time-item ${selectedTime === i+1 ? 'active' : ''}`}
                onClick={() => setSelectedTime(i+1)}
              >
                {(i+1).toString().padStart(2, '0')}
              </div>
              ))}
            </div>
          </div>

          <div className="button-group">
            <button className={`button-left ${!selectedTime ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleConfirmTime}>confirm</button>
            <button className="button-right" onClick={() => setStep('recipes')}>back</button>
          </div>
        </>
      )}

      {/* 3 - countdown */}
      {step === 'countdown' && (
        <>
          <h2 className="page-title">your recipe is done in ...</h2>
        <div>  
          <div className="selected-recipe-display">
            <img src={selectedRecipe?.img} alt=""/>
          </div>

          <div className="timer-display">
            {minutes.toString().padStart(2, '0')} : {seconds.toString().padStart(2, '0')}
          </div>

          <div className="button-group">
            <button className="button-left" onClick={() => setIsActive(!isActive)}>{!isActive && secondsLeft === selectedTime * 60 ? 'start' : isActive ? 'pause' : 'continue'}</button>
            <button onClick={onBack} className="button-right">cancel</button>
          </div>
        </div>
      </>
      )}
      {/* 4 - finished */}
      {step === 'finished' && (
        <>
          <h2 className="page-title">your recipe is ready! enjoy!</h2>
          
          <div className="selected-recipe-display">
            <img src={selectedRecipe?.img} alt="" className="pulse-animation" />
          </div>

          <p className="finished">you focused for{' '}
            <br />
            <span className="finished-number">{selectedTime}</span>
            {' '}{selectedTime === 1 ? 'minute' : 'minutes'} on{' '}
            <span className="finished-number">{endDate}</span>
          </p>

          <div className="button-group">
            <button className="button-left" onClick={() => {setStep('recipes'); setSelectedTime(null); setIsActive(false)}}>summary</button>
            <button onClick={onBack} className="button-right">home</button>
          </div>
        </>
      )}

    </div>
  );
};

export default Timer;
