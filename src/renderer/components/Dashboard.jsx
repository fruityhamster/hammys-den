import React, { useState, useEffect } from 'react';

// images imports
import to_do_list from '../assets/dashboard-to-do-list.png'; 
import calendar from '../assets/dashboard-calendar.png';
import timer from '../assets/dashboard-timer.png';
import history from '../assets/dashboard-history.png';

const Dashboard = ({ onNavigate }) => {
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

            <div className="base-background bg-[var(--color-hammy-brown)]"></div>

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
        </div>
    );
};

export default Dashboard;