import { useState } from "react"; /* useEffect */
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


  // function called when cliking on the food
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setStep('select-time');
  };
  
  // function for the minutes selection and confirm button
  const handleConfirmTime = () => {
    // if there's no time selected - blocks
    if (!selectedTime) {
      return; 
    }
    // of there's time selected - moves to 'countdown'
    setStep('countdown');
  };

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
              <button key={recipe.id} className="recipe-card" onClick={() => { handleRecipeClick(recipe); ('select-time'); }}>
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
            <button className="button-right" onClick={() => setStep('recipes')} >back</button>
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
            {selectedTime.toString().padStart(2, '0')} : 00
          </div>

          <div className="button-group">
            <button className="button-left">start</button>
            <button onClick={onBack} className="button-right">home</button>
          </div>
        </div>
      </>
      )}
    </div>
  );
};

export default Timer;
