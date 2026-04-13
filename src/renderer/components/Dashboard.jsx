import React from 'react';

const Dashboard = ({ onNavigate }) => {
  // Configuração dos botões para não repetir código
  const modules = [
    { id: 'to-do', label: 'to-do', icon: '🌱' },
    { id: 'calendar', label: 'calendar', icon: '📅' },
    { id: 'timer', label: 'timer', icon: '⏳' },
    { id: 'history', label: 'history', icon: '🌻' },
  ];

  return (
    <div className="app-container">
      {/* superior bar (draggable) */}
        <div className="flex justify-between items-center mb-6" style={{ WebkitAppRegion: 'drag' }}>
            <div className="main-title">hammy's den &lt;3</div>
            {/* os botões de fechar/minimizar NÃO podem ser arrastáveis */}
            <div className="flex gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
                <button className="min-close-buttons">_</button>
                <button className="min-close-buttons" onClick={() => window.close()} style={{ WebkitAppRegion: 'no-drag' }}>x</button>
            </div>
        </div>

        <div className="base-background bg-[var(--color-hammy-brown)]"></div>

    </div>
  );
};

export default Dashboard;