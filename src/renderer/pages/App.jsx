/* Import do React e do Hook useState */
import React, { useState } from 'react';

/* all components imported */
import Dashboard from "../components/Dashboard";
import TodoList from "../components/TodoList";
import MyCalendar from "../components/Calendar";
import Timer from "../components/Timer";
/*  import History from '../components/history';
    import Login from '../components/login';
*/

function App() {
  // state to know what page we are on (log in ainda não está feito, começa na Dashboard)
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Função para mudar de página
  const navigateTo = (page) => setCurrentPage(page);

  return (
    <div>
      {/* a app escolhe o que renderizar baseada no estado */}
      {currentPage === 'dashboard' && <Dashboard onNavigate={navigateTo} />}

      {/* Se o estado mudar para 'todo', montamos a página da To-do List */}
      {currentPage === 'todo' && <TodoList onBack={() => setCurrentPage('dashboard')} />}

    </div>    
  );
}

export default App;
