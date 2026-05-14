/* Import do React e do Hook useState */
import React, { useState } from 'react';

/* all components imported */
import Dashboard from "../components/Dashboard";
import TodoList from "../components/TodoList";
import CalendarPage from "../components/Calendar";
import Timer from "../components/Timer";
import History from '../components/History';
import Login from '../components/Login';

function App() {
  const [user, setUser] = useState(null);
  // state to know what page we are on
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingSession, setEditingSession] = useState(null);

  // function to change pages
  const navigateTo = (page) => setCurrentPage(page);

  const openHistorySession = (session) => {
    setEditingSession(session); // saves the data from the clicked session
    setCurrentPage('timer');    // sends the user to the timer page
  };

  // if there is no user, shows login page
  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div>
      {/* if there is an user, send the ID of the user to everything */}
      {currentPage === 'dashboard' && (<Dashboard onNavigate={navigateTo} userId={user.id} setUser={setUser}/>)}

      {/* if state changes to 'todo' shows 'To-do List' page */}
      {currentPage === 'todo' && <TodoList onBack={() => setCurrentPage('dashboard')} userId={user.id} setUser={setUser} />}

      {/* if state changes to 'calendar' shows 'Calendar' page */}
      {currentPage === 'calendar' && <CalendarPage onBack={() => setCurrentPage('dashboard')} userId={user.id} setUser={setUser} />}
      
      {currentPage === 'timer' && (<Timer onBack={() => { setCurrentPage('dashboard'); setEditingSession(null);}} editData={editingSession} userId={user.id} setUser={setUser}/>)}

      {currentPage === 'history' && (<History onBack={() => setCurrentPage('dashboard')} onEditSession={openHistorySession} userId={user.id} setUser={setUser}/>)}
    </div>
  );
}

export default App;
