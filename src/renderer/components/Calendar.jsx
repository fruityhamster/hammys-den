import { useState } from "react";
import { default as LibCalendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import seedImg from '../assets/dashboard-almond.png';

const CalendarPage = ({ onBack }) => {

  const [date, setDate] = useState(new Date());

  // function to add especial classes to days
  const getTileClassName = ({ date: tileDate, view }) => {
    if (view === 'month') {
      const today = new Date();
      const isToday = tileDate.getDate() === today.getDate() &&
                      tileDate.getMonth() === today.getMonth() &&
                      tileDate.getFullYear() === today.getFullYear();

      let classes = "";
      
      // if it's today, add 'is-today'
      if (isToday) classes += " is-today";
      
      // if it's weekend (Sábado=6, Domingo=0)
      if (tileDate.getDay() === 0 || tileDate.getDay() === 6) classes += " weekend-tile";

      return classes;
    }
  };

  // function to show the dot on days with tasks added
  const getTileContent = ({ date, view: calendarView }) => {
    if (calendarView === 'month') {
      // to show on the correct date
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

  const [view, setView] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksByDate, setTasksByDate] = useState({});

  // function to open tasks from the selected day
  const handleDayClick = (date) => {
    // local methods to prevent skipping days
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
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
      // gets the existing tasks list from the day (or empty)
      const existingTasks = prev[selectedDate] || [];
      // creates the new object with new the new task added
      return {
        ...prev,
        [selectedDate]: [...existingTasks, newTask]
      };
    });
    // cleans input
    setTaskTime("");
    setTaskInput("");
    };

  // gets the original list (or empty)
  const currentTasksUnsorted = tasksByDate[selectedDate] || [];

  // create a new orderedd version
  const currentTasks = [...currentTasksUnsorted].sort((a, b) => {
    // if 'a' doesn't has a time but 'b' has, 'a' goes under (vice versa)
    if (!a.time && b.time) return 1;
    if (a.time && !b.time) return -1;
  
    // if both have time, compare strings/time
    return a.time.localeCompare(b.time);
  });

  // complete button
  const toggleComplete = (id) => {
    setTasksByDate(prev => ({
      ...prev,
      [selectedDate]: (prev[selectedDate] || []).map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  // delete button
  const deleteTask = (id) => {
    setTasksByDate(prev => ({
      ...prev,
      [selectedDate]: (prev[selectedDate] || []).filter(task => task.id !== id)
    }));
  };

  // function to format date (2026-04-09 to 09-04-2026)
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

    {/* page: monthly view */}
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
            onClickDay={handleDayClick} // opens tasks when clicked
            tileContent={getTileContent} // shows dot under the day with tasks added
          />
        </div>

        {/* "home" button */}
        <div className="flex justify-center">
          <button onClick={onBack} className="button-center1">home</button>
        </div>
      </>
    ) : (
      <>
        {/* page: tasks for the specific day with time */}
        <h3 className="selected-date-title">{formatDateDisplay(selectedDate)}</h3>
        {/* add button + input section */}
        <div className="add-input-group">
          {/* add button */}
          <button onClick={addNewSeed} className="add-button-calendar">+</button>

          {/* input field hours */}
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