import { useState, useEffect } from "react";
/* import recipes images */
import bubble_tea from '../assets/timer-bubble-tea.png'; 
import sushi from '../assets/timer-sushi.png';
import blueberry_cake from '../assets/timer-blueberry-cake.png';
import pancakes from '../assets/timer-pancakes.png';
import ExitModal from '../components/Exit';
import SettingsModal from '../components/Settings';
import useAppControls from '../components/ButtonsME';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const { ipcRenderer } = window.require('electron');

const Timer = ({ onBack, editData, userId, setUser }) => {
  // ButtonsME
  const { 
    isModalOpen, 
    setIsModalOpen, 
    minimizeApp, 
    closeApp, 
    handleExit, 
    handleLogout 
  } = useAppControls(userId, setUser);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { t, i18n } = useTranslation();

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
  const [createdSessionId, setCreatedSessionId] = useState(null);

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

      // saves in ISO format YYYY-MM-DD
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const isoDate = `${year}-${month}-${day}`;
      
      setEndDate(isoDate);
      setStep('finished');

      // save session when countdown = 0
      const saveInitialSession = async () => {
        const sessionData = {
          userId: userId,
          recipe: selectedRecipe.name,
          duration: selectedTime,
          notes: "", // starts empty
        };
        
        // saves and get back the session created
        const newSession = await ipcRenderer.invoke('add-session', sessionData);
        
        // save the ID in a state to update the notes in the future
        setCreatedSessionId(newSession.id);
      }
      saveInitialSession();
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
        userId: userId,
        recipe: selectedRecipe.name,
        duration: selectedTime,
        notes: summaryText,
      };

      if (editData) {
        // updating existent session
        await ipcRenderer.invoke('update-session', {
          id: editData.id,
          data: { notes: summaryText } // change only the notes
        });
      } else if (createdSessionId) {
        // create new session
        await ipcRenderer.invoke('update-session', {
          id: createdSessionId,
          data: { notes: summaryText }
        });
      }
      setCreatedSessionId(null);
      onBack(); // back to dashboard
    } catch (error) {
      console.error("Error saving session:", error);
    };
  };
  
  const handleHomeClick = async () => {
    setCreatedSessionId(null);
    onBack();
  };

  // format date depending on the language
  const formatEndDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    
    // split
    let parts = dateStr.split("-");
    let year, month, day;

    if (parts[0].length === 4) {
      // YYYY-MM-DD
      [year, month, day] = parts;
    } else {
      // DD-MM-YYYY
      [day, month, year] = parts;
    }
    
    // show
    if (i18n.language && i18n.language.startsWith('en')) {
      return `${month}-${day}-${year}`; // US MM-DD-YYYY
    }
    return `${day}-${month}-${year}`; // PT+ DD-MM-YYYY
  };

  return (
    <div className="app-container">
      {/* superior bar (draggable) */}
      <div className="flex justify-between items-center mb-6">
        <div className="main-title" style={{ WebkitAppRegion: 'drag' }}>hammy's den &lt;3</div>
        {/* buttons min&close (not draggable) */}
        <div className="flex gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
            {/* settings button */}
            <button className="min-close-buttons settings-top-btn" onClick={() => setIsSettingsOpen(true)}>
                <Settings className="settings-icon" />
            </button>
            <button className="min-close-buttons" onClick={minimizeApp}>_</button>
            <button className="min-close-buttons" onClick={closeApp}>x</button>
        </div>
      </div>
      <div className="base-background"></div>

      {/* 1 - recipes */}
      {step === 'recipes' && (
        <>
          <h2 className="page-title">{t('timer.tittle')}</h2>

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
            <button onClick={onBack} className="button-center1">{t('timer.back')}</button>
          </div>
        </>
      )}

      {/* 2 - select time/minutes */}
      {step === 'select-time' && (
        <>
          <h2 className="page-title">{t('timer.tittle2')}</h2>
          <h3 className="page-subtitle">{t('timer.min')}</h3>

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
            <button className={`button-left ${!selectedTime ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleConfirmTime}>{t('timer.confirm')}</button>
            <button className="button-right" onClick={() => setStep('recipes')}>{t('timer.back')}</button>
          </div>
        </>
      )}

      {/* 3 - countdown */}
      {step === 'countdown' && (
        <>
          <h2 className="page-title">{t('timer.tittle3')}</h2>
        <div>  
          <div className="selected-recipe-display">
            <img src={selectedRecipe?.img} alt=""/>
          </div>

          <div className="timer-display">
            {minutes.toString().padStart(2, '0')} : {seconds.toString().padStart(2, '0')}
          </div>

          <div className="button-group">
            <button className="button-left" onClick={() => setIsActive(!isActive)}>{!isActive && secondsLeft === selectedTime * 60 ? t('timer.start') : isActive ? t('timer.pause') : t('timer.continue')}</button>
            <button onClick={onBack} className="button-right">{t('timer.cancel')}</button>
          </div>
        </div>
      </>
      )}

      {/* 4 - finished */}
      {step === 'finished' && (
        <>
          <h2 className="page-title">{t('timer.tittle4')}</h2>
          
          <div className="selected-recipe-display">
            <img src={selectedRecipe?.img} alt="" className="pulse-animation" />
          </div>

          <p className="finished">{t('timer.focused')}{' '}
            <br />
            <span className="finished-number">{selectedTime}</span>{' '}
            {' '}{selectedTime === 1 ? t('timer.minute') : t('timer.minutes')}{' '}
            {t('timer.on')}{' '}
            <span className="finished-number">{formatEndDateDisplay(endDate)}</span>
          </p>

          <div className="button-group">
            <button className="button-left" onClick={() => {setStep('summary'); }}>{t('timer.summary')}</button>
            <button className="button-right" onClick={handleHomeClick}>{t('timer.menu')}</button>
          </div>
        </>
      )}

      {/* 5 - summary */}
      {step === 'summary' && (
        <>
          <h2 className="page-title">{t('timer.summary')}</h2>

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
            <button className="button-left" onClick={handleSaveSummary}>{t('timer.save')}</button>
            <button className="button-right" onClick={handleHomeClick}>{t('timer.menu')}</button>
          </div>
        </>
      )}
      {isModalOpen && (
        <ExitModal 
          onCancel={() => setIsModalOpen(false)} 
          onLogout={handleLogout} 
          onExit={handleExit} 
        />
      )}
      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal onCancel={() => setIsSettingsOpen(false)}/>
      )}
    </div>
  );
};

export default Timer;
