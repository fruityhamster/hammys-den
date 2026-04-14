import React from 'react';

const Dashboard = ({ onNavigate }) => {

// buttons configurations - avoids repeting code
const modules = [
    { id: 'to-do', label: 'to-do', icon: '🌱' },
    { id: 'calendar', label: 'calendar', icon: '📅' },
    { id: 'timer', label: 'timer', icon: '⏳' },
    { id: 'history', label: 'history', icon: '🌻' },
];

// minimize app
const minimizeApp = () => {
    if (window.require) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('minimize-app');
    } else {
        console.warn("Electron IPC não encontrado");
    };
};

    return (
        <div className="app-container">
            {/* superior bar (draggable) */}
            <div className="flex justify-between items-center mb-6" style={{ WebkitAppRegion: 'drag' }}>
                <div className="main-title">hammy's den &lt;3</div>
                {/* buttons min&close (not draggable) */}
                <div className="flex gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
                    <button className="min-close-buttons" onClick={minimizeApp}>_</button>
                    <button className="min-close-buttons" onClick={() => window.close()}>x</button>
                </div>
            </div>

            <div className="base-background bg-[var(--color-hammy-brown)]"></div>

            <div className="dashboard"></div>

        </div>
    );
};

export default Dashboard;