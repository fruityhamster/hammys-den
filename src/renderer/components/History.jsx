import { useState, useEffect } from "react";
/* import recipes images */
import bubble_tea from '../assets/timer-bubble-tea.png'; 
import sushi from '../assets/timer-sushi.png';
import blueberry_cake from '../assets/timer-blueberry-cake.png';
import pancakes from '../assets/timer-pancakes.png';
import ExitModal from '../components/Exit';
import SettingsModal from '../components/Settings';
import useAppControls from '../components/ButtonsME';
import useAppControls2 from '../components/ButtonS';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const { ipcRenderer } = window.require('electron');

const History = ({ onBack, onEditSession, userId, setUser }) => {
  // ButtonsME
  const { 
    isModalOpen, 
    setIsModalOpen, 
    minimizeApp, 
    closeApp, 
    handleExit, 
    handleLogout 
  } = useAppControls(userId, setUser);

  //ButtonS
  const {
    isSettingsOpen, // variable
    setIsSettingsOpen,
    handleAccount,
    handleLanguage,
    handleContact
  } = useAppControls2();

  const { t, i18n } = useTranslation();

  const [sessions, setSessions] = useState([]);

  // dictionary to connect the text from BD to the real image (add here for future images)
  const recipeImages = {
    bubble_tea,
    sushi,
    blueberry_cake,
    pancakes
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await ipcRenderer.invoke('get-sessions', userId);
        setSessions(data);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    };

    loadHistory();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    if (i18n.language && i18n.language.startsWith('en')) {
      return `${month}-${day}-${year}`; // US: MM-DD-YYYY
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

      <h2 className="page-title">{t('history.tittle')}</h2>

      <div className="history-grid">
        {sessions.map((session) => (
          <button key={session.id} onClick={() => onEditSession(session)} className="history-grid-button">
            <div className="history-card">
              <img src={recipeImages[session.recipe]} alt="" draggable="false" />
            </div>
              <p className="history-text">
                <span className="history-text-number">{session.duration}</span>
                {' '}{session.duration === 1 ? t('timer.minute') : t('timer.minutes')}{' '} 
                {t('timer.on')}{' '}
                <span className="history-text-number">{formatDate(session.createdAt)}</span>
              </p>
          </button>
        ))}
      </div>
    
      {/* "home" button */}
      <div className="flex justify-center">
        <button onClick={onBack} className="button-center1">{t('history.menu')}</button>
      </div>
      {isModalOpen && (
        <ExitModal 
          onCancel={() => setIsModalOpen(false)} 
          onLogout={handleLogout} 
          onExit={handleExit} 
        />
      )}
      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal 
          onCancel={() => setIsSettingsOpen(false)} 
          onAccount={handleAccount}
          onLanguage={handleLanguage}
          onContact={handleContact}
        />
      )}
    </div>
  );
};

export default History;