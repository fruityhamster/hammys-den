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
  const [user, setUser] = useState(() => {
    // tries to get user from localStorage in the beginning 
    const saved = localStorage.getItem('savedUser');
    return saved ? JSON.parse(saved) : null;
  });

  // state to know what page we are on
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingSession, setEditingSession] = useState(null);

  // logout function
  const handleLogout = () => {
    localStorage.removeItem('savedUser'); // deletes from disk
    setUser(null);                        // deletes from screen/memory
    setCurrentPage('dashboard');          // reset to dashboard
  };

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

  const uid = user.id || user._id || user.userId;

  return (
    <div>
      {/* if there is an user, send the ID of the user to everything */}
      {currentPage === 'dashboard' && (<Dashboard onNavigate={navigateTo} userId={uid} user={user} setUser={handleLogout}/>)}

      {/* if state changes to 'todo' shows 'To-do List' page */}
      {currentPage === 'todo' && <TodoList onBack={() => setCurrentPage('dashboard')} userId={uid} setUser={handleLogout} />}

      {/* if state changes to 'calendar' shows 'Calendar' page */}
      {currentPage === 'calendar' && <CalendarPage onBack={() => setCurrentPage('dashboard')} userId={uid} setUser={handleLogout} />}
      
      {currentPage === 'timer' && (<Timer onBack={() => { setCurrentPage('dashboard'); setEditingSession(null);}} editData={editingSession} userId={uid} setUser={handleLogout}/>)}

      {currentPage === 'history' && (<History onBack={() => setCurrentPage('dashboard')} onEditSession={openHistorySession} userId={uid} setUser={handleLogout}/>)}
    </div>
  );
}

export default App;
