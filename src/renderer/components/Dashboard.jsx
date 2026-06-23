import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import ExitModal from '../components/Exit';
import SettingsModal from '../components/Settings';
import useAppControls from '../components/ButtonsME';

// images imports
import to_do_list from '../assets/dashboard-to-do-list.png'; 
import calendar from '../assets/dashboard-calendar.png';
import timer from '../assets/dashboard-timer.png';
import history from '../assets/dashboard-history.png';

const Dashboard = ({ onNavigate, userId, user, setUser }) => {
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

    // date state
    const [today, setToday] = useState(new Date());
    // function checks the time every minute (60 seconds)
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            // if the day changes, time is updated
            if (now.getDate() !== today.getDate()) {
                setToday(now);
            }
        }, 60000);
        // clear timer when not in the page
        return () => clearInterval(timer);
    }, [today]);

    const month = today.toLocaleString(i18n.language, { month: 'long' });
    const dayNum = today.getDate().toString().padStart(2, '0');
    const weekDay = today.toLocaleString(i18n.language, { weekday: 'long' }).replace('-feira', ''); // removes "-feira" if exists

    // buttons configurations - avoids repeting code
    const modules = [
        { id: 'todo', label:'dashboard.todo', img: to_do_list },
        { id: 'calendar', label:'dashboard.calendar', img: calendar },
        { id: 'timer', label:'dashboard.timer', img: timer },
        { id: 'history', label:'dashboard.history', img: history },
    ];

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

            <div className="dashboard" style={{ WebkitAppRegion: 'no-drag' }}>
                {modules.map((mod) => (
                    <button key={mod.id} className="grid-button" onClick={() => onNavigate(mod.id)}>
                        
                        {/* calendar logic */}
                        {mod.id === 'calendar' ? (
                            <div className="calendar-widget">
                                {/* month */}
                                <span className="cal-month">{month}</span>
                                
                                {/* day */}
                                <div>
                                    <img src={mod.img} alt="" className="cal-seed-img" />
                                    <span className="cal-day-number">{dayNum}</span>
                                </div>
                                
                                {/* weekday */}
                                <span className="cal-weekday">{weekDay}</span>
                            </div>
                        ) : (
                            // normal logic for other images/buttons
                            <img src={mod.img} alt="" draggable="false"/>
                        )}
                        
                        {/* texts under buttons */}
                        <span>{t(mod.label)}</span> 
                    </button>
                ))}
            </div>
            
            <div className="hello-user">
                hey {user?.name || 'Hammy'} !
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
                <SettingsModal onCancel={() => setIsSettingsOpen(false)}
                    isLoggedIn={true}
                    userId={user} // saves logged user
                    setUser={setUser} // updates user
                />
            )}
        </div>
    );
};

export default Dashboard;