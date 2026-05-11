/* Import do React e do Hook useState */
import React, { useState } from 'react';

/* all components imported */
import Dashboard from "../components/Dashboard";
import TodoList from "../components/TodoList";
import CalendarPage from "../components/Calendar";
import Timer from "../components/Timer";
import History from '../components/History';
/* import Login from '../components/login'; */

function App() {
  // state to know what page we are on (log in ainda não está feito, começa na Dashboard)
  const [currentPage, setCurrentPage] = useState('dashboard');

  // function to change pages
  const navigateTo = (page) => setCurrentPage(page);

  const [editingSession, setEditingSession] = useState(null);

  const openHistorySession = (session) => {
    setEditingSession(session); // saves the data from the clicked session
    setCurrentPage('timer');    // sends the user to the timer page
  };

  return (
    <div>
      {/* app chooses what to render based on the state */}
      {currentPage === 'dashboard' && <Dashboard onNavigate={navigateTo} />}

      {/* if state changes to 'todo' shows 'To-do List' page */}
      {currentPage === 'todo' && <TodoList onBack={() => setCurrentPage('dashboard')} />}

      {/* if state changes to 'calendar' shows 'Calendar' page */}
      {currentPage === 'calendar' && <CalendarPage onBack={() => setCurrentPage('dashboard')} />}
      
      {currentPage === 'timer' && (<Timer onBack={() => { setCurrentPage('dashboard'); setEditingSession(null); }} editData={editingSession} />)}

      {currentPage === 'history' && (<History onBack={() => setCurrentPage('dashboard')} onEditSession={openHistorySession} />)}
    </div>
  );
}

export default App;
