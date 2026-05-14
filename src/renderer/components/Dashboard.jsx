import React, { useState, useEffect } from 'react';

import ExitModal from '../components/Exit';
import useAppControls from '../components/ButtonsME';

// images imports
import to_do_list from '../assets/dashboard-to-do-list.png'; 
import calendar from '../assets/dashboard-calendar.png';
import timer from '../assets/dashboard-timer.png';
import history from '../assets/dashboard-history.png';

const Dashboard = ({ onNavigate, userId, setUser }) => {
    // ButtonsME
    const { 
        isModalOpen, 
        setIsModalOpen, 
        minimizeApp, 
        closeApp, 
        handleExit, 
        handleLogout 
    } = useAppControls(userId, setUser);

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
            console.log("Verifiquei a hora!"); // for tests
        }, 60000);
        // clear timer when not in the page
        return () => clearInterval(timer);
    }, [today]);

    const month = today.toLocaleString('en-US', { month: 'long' });
    const dayNum = today.getDate().toString().padStart(2, '0');
    const weekDay = today.toLocaleString('en-US', { weekday: 'long' });

    // buttons configurations - avoids repeting code
    const modules = [
        { id: 'todo', label:'to-do list', img: to_do_list },
        { id: 'calendar', label:'calendar', img: calendar },
        { id: 'timer', label:'timer', img: timer },
        { id: 'history', label:'history', img: history },
    ];

    return (
        <div className="app-container">
            {/* superior bar (draggable) */}
            <div className="flex justify-between items-center mb-6">
                <div className="main-title" style={{ WebkitAppRegion: 'drag' }}>hammy's den &lt;3</div>
                {/* buttons min&close (not draggable) */}
                <div className="flex gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
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
                        <span>{mod.label}</span> 
                    </button>
                ))}
            </div>
            {isModalOpen && (
                <ExitModal 
                    onCancel={() => setIsModalOpen(false)} 
                    onLogout={handleLogout} 
                    onExit={handleExit} 
                />
            )}
        </div>
    );
};

export default Dashboard;