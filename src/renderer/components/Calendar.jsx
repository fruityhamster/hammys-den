import { useState } from "react";
import { default as LibCalendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import seedImg from '../assets/dashboard-almond.png';

const CalendarPage = ({ onBack }) => {

  const [date, setDate] = useState(new Date());

  // Função para adicionar classes especiais aos dias
  const getTileClassName = ({ date: tileDate, view }) => {
    if (view === 'month') {
      const today = new Date();
      const isToday = tileDate.getDate() === today.getDate() &&
                      tileDate.getMonth() === today.getMonth() &&
                      tileDate.getFullYear() === today.getFullYear();

      let classes = "";
      
      // Se for hoje, adiciona a classe 'is-today'
      if (isToday) classes += " is-today";
      
      // Se for fim de semana (Sábado=6, Domingo=0)
      if (tileDate.getDay() === 0 || tileDate.getDay() === 6) classes += " weekend-tile";

      return classes;
    }
  };

  // Função para colocar o pontinho/semente nos dias com tarefas
  const getTileContent = ({ date, view: calendarView }) => {
    if (calendarView === 'month') {
      // Mesma lógica aqui para o pontinho aparecer no dia certo
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      if (tasksByDate[dateStr] && tasksByDate[dateStr].length > 0) {
        return <div className="task-dot">.</div>;
      }
    }
    return null;
  };

  const [view, setView] = useState("calendar"); // "calendar" ou "day-tasks"
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksByDate, setTasksByDate] = useState({});

  // Função para abrir as tasks de um dia
  const handleDayClick = (date) => {
    // Em vez de toISOString(), usamos métodos locais para evitar saltos de dia
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
    const day = String(date.getDate()).padStart(2, '0');
    
    const dateStr = `${year}-${month}-${day}`;
    
    setSelectedDate(dateStr);
    setView("day-tasks");
  };

  // state to control what the user writes in the input
  const [taskInput, setTaskInput] = useState('');

  // function to add a new task
  const [taskTime, setTaskTime] = useState("");

  const addNewSeed = () => {
    if (taskInput.trim() === "" || !selectedDate) return;

    const newTask = {
      id: Date.now(),
      time: taskTime,
      text: taskInput,
      completed: false // task 'not completed'
    };

    setTasksByDate(prev => {
      // 1. Pegamos na lista de tarefas que já existe para aquele dia (ou uma vazia [])
      const existingTasks = prev[selectedDate] || [];
      // 2. Criamos o novo objeto com a nova tarefa adicionada
      return {
        ...prev,
        [selectedDate]: [...existingTasks, newTask]
      };
    });
    
    setTaskTime("");
    setTaskInput(""); // Limpa o input
    };



  // 1. Pegamos na lista original (ou vazia)
  const currentTasksUnsorted = tasksByDate[selectedDate] || [];

  // 2. Criamos uma versão ordenada
  const currentTasks = [...currentTasksUnsorted].sort((a, b) => {
    // Se 'a' não tiver hora mas 'b' tiver, 'a' vai para baixo
    if (!a.time && b.time) return 1;
    // Se 'b' não tiver hora mas 'a' tiver, 'b' vai para baixo
    if (a.time && !b.time) return -1;
  
  // Se ambos tiverem hora, comparamos as strings (ex: "09:00" < "14:00")
  return a.time.localeCompare(b.time);
});

  const toggleComplete = (id) => {
    setTasksByDate(prev => ({
      ...prev,
      [selectedDate]: (prev[selectedDate] || []).map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const deleteTask = (id) => {
    setTasksByDate(prev => ({
      ...prev,
      [selectedDate]: (prev[selectedDate] || []).filter(task => task.id !== id)
    }));
  };

  // Função para formatar a data de 2026-04-09 para 09-04-2026
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

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
    <div className="base-background"></div>

    <h2 className="page-title">calendar</h2>

    {view === "calendar" ? (
      <>
        <div className="calendar-main-box">
          <LibCalendar 
            onChange={setDate} 
            value={date}
            tileClassName={getTileClassName}
            locale="en-US" // week starts on sunday
            formatShortWeekday={(locale, date) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]}
            navigationLabel={({ date }) => (
              <div className="calendar-title-container">
                <span className="calendar-title-month">
                  {date.toLocaleString('en-US', { month: 'long' }).toUpperCase()}
                </span>
                <span className="calendar-title-year">
                  {date.getFullYear()}
                </span>
              </div>
            )}
            onClickDay={handleDayClick} // AQUI: Abre as tasks ao clicar
            tileContent={getTileContent} // AQUI: Mostra o pontinho
          />
        </div>

        {/* "home" button */}
        <div className="flex justify-center">
          <button onClick={onBack} className="button-center1">home</button>
        </div>
      </>
    ) : (
      <>
        <h3 className="selected-date-title">{formatDateDisplay(selectedDate)}</h3>
        {/* add button + input section */}
        <div className="add-input-group">
          {/* add button */}
          <button onClick={addNewSeed} className="add-button-calendar">+</button>

          {/* Input field hours */}
          <input
            type="time" 
            value={taskTime} 
            onChange={(e) => setTaskTime(e.target.value)}
            className="time-input-box"
          />
          
          {/* input field text */}
          <input type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            /* allows using Enter key to add task */
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addNewSeed();
              }
            }}
            placeholder="add a new seed..." 
            className="input-field-calendar" 
            style={{ imageRendering: 'pixelated' }}/>         
        </div>

      {/* tasks added */}
      <div className="task-show-field">
        {/*show tasks */}
        <ul className="space-y-3 overflow-y-auto max-h-[260px]">
          {currentTasks.map(task => (
            <li key={task.id} className="task-item">
              {/* seed image */}
              <img src={seedImg} alt="seed" className="task-seed-icon" />
              {/* show time */}
              <span className="task-time-text">{task.time}</span>
              {/* conditional class to cross out the task */}
              <span className={`task-text ${task.completed ? 'completed' : ''}`}>{task.text}</span>
              <div className="task-actions">
                <button onClick={() => toggleComplete(task.id)} className="btn-check"></button>
                <button onClick={() => deleteTask(task.id)} className="btn-delete"></button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center">
        <button onClick={() => setView("calendar")} className="button-center1">back</button>
      </div>
      </>
    )}
    </div>
  );
};

export default CalendarPage;