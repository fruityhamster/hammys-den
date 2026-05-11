import { useState, useEffect } from "react";
/* import recipes images */
import bubble_tea from '../assets/timer-bubble-tea.png'; 
import sushi from '../assets/timer-sushi.png';
import blueberry_cake from '../assets/timer-blueberry-cake.png';
import pancakes from '../assets/timer-pancakes.png';
const { ipcRenderer } = window.require('electron');

// temporary variable for communication with DB
const TEMP_USER_ID = "6a259554-32b2-43dc-adb8-0a884e7d7d11";

const Timer = ({ onBack, editData }) => {
  
  // recipes images (add here for future images + history)
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
  const [summaryText, setSummaryText] = useState('> '); // starts with 1st topic

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

      // gets the atual date and formats DD-MM-AAAA
      const now = new Date();
      const displayDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
      
      setEndDate(displayDate);
      setStep('finished');
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, editData]);

  useEffect(() => {
    if (editData) {
      // if there is editing date jumps directly to summary page
      setSelectedRecipe({ name: editData.recipe, img: editData.img });
      setSelectedTime(editData.duration);
      setEndDate(editData.date);
      setSummaryText(editData.notes);
      setStep('summary'); 
    }
  }, [editData]);

  const handleSummaryKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // prevents Enter key to skip a line
      setSummaryText(prev => prev + '\n> '); //adds a new line + symbol
    }
  };

  const handleSummaryChange = (e) => {
    const value = e.target.value;
    // prevents the user from deleting the 1st ">"
    if (!value.startsWith('> ')) {
      setSummaryText('> ' + value.replace(/^>+/, '').trimStart());
    } else {
      setSummaryText(value);
    }
  };

  const handleSaveSummary = async () => {
    try {
      // preparing data for Prisma: if editing use original date, if new use a new date in ISO format
      const sessionDate = editData ? new Date(editData.originalDate) : new Date();

      const sessionData = {
        userId: TEMP_USER_ID,
        recipe: selectedRecipe.name,
        duration: selectedTime,
        notes: summaryText,
      };

      if (editData) {
        // updating existent session
        await ipcRenderer.invoke('update-session', {
          id: editData.id,
          data: {
            notes: summaryText // change only the notes
          }
        });
        console.log("Sessão atualizada na DB!");

        // clears after saving
        setSelectedTime(null);
        onBack();
      } else {
        // create new session
        await ipcRenderer.invoke('add-session', sessionData);
        console.log("Nova sessão salva na DB!");
      }

      onBack(); // back to dashboard
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
      alert("Erro ao salvar na base de dados!");
    }
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
            <button className="button-left" onClick={() => {setStep('summary'); }}>summary</button>
            <button className="button-right" onClick={onBack}>home</button>
          </div>
        </>
      )}

      {/* 5 - summary */}
      {step === 'summary' && (
        <>
          <h2 className="page-title">summary</h2>

          <div className="summary-container">
            <textarea
              className="summary-text"
              value={summaryText}
              onChange={handleSummaryChange}
              onKeyDown={handleSummaryKeyDown}
              spellCheck="false"
            />
          </div>

          <div className="button-group">
            <button className="button-left" onClick={handleSaveSummary}>save</button>
            <button className="button-right" onClick={onBack}>home</button>
          </div>
        </>
      )}

    </div>
  );
};

export default Timer;
