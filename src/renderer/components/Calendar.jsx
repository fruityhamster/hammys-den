import { useState, useEffect } from "react";
import { default as LibCalendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import seedImg from '../assets/dashboard-almond.png';
import ExitModal from '../components/Exit';
import SettingsModal from '../components/Settings';
import useAppControls from '../components/ButtonsME';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const { ipcRenderer } = window.require('electron');

const CalendarPage = ({ onBack, user, userId, setUser }) => {
  // ButtonsME
  const { 
    isModalOpen, 
    setIsModalOpen, 
    minimizeApp, 
    closeApp, 
    handleExit, 
    handleLogout 
  } = useAppControls(userId, setUser);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { t, i18n } = useTranslation();

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksByDate, setTasksByDate] = useState({});
  // state to control what the user writes in the input
  const [taskInput, setTaskInput] = useState('');
  // function to add a new task
  const [taskTime, setTaskTime] = useState("");

  // load BD events
  useEffect(() => {
    async function loadEvents() {
      try {
        const dbEvents = await ipcRenderer.invoke('get-events', userId);
        
        // transform the list in the date format wanted { "2026-05-07": [...] }
        const organized = {};

        dbEvents.forEach(ev => {
          try {
            // extract only the YYYY-MM-DD part of the date from ISOString
            const d = new Date(ev.startDate);
            if (isNaN(d.getTime())) return; // ignores if invalid date

            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            if (!organized[dateStr]) organized[dateStr] = [];
            
            // time + text = tittle. "HH:mm | description"
            organized[dateStr].push({
              id: ev.id,
              time: ev.title.includes(' | ') ? ev.title.split(' | ')[0] : "",
              text: ev.title.includes(' | ') ? ev.title.split(' | ')[1] : ev.title,
              completed: ev.completed || false
            });
          } catch (e) {
            console.error("Error processing individual event:", e);
          }
        });
        setTasksByDate(organized);
      } catch (err) {
        console.error("Error loading events:", err);
      }
    }
    loadEvents();
  }, []);

  // add new tasks
  const addNewSeed = async () => {
    if (taskInput.trim() === "" || !selectedDate) return;

    try {
      // completed date matching selectedDate (YYYY-MM-DD) com taskTime (HH:mm)
      const combinedDateTime = new Date(`${selectedDate}T${taskTime || "00:00"}:00`);

      const newEvent = await ipcRenderer.invoke('add-event', {
        title: `${taskTime} | ${taskInput}`, // time + text = tittle
        startDate: combinedDateTime,
        userId: userId,
        allDay: false
      });

      const newTask = {
        id: newEvent.id,
        time: taskTime,
        text: taskInput,
        completed: false
      };

      setTasksByDate(prev => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), newTask]
      }));

      setTaskTime("");
      setTaskInput("");
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  // delete BD events
  const deleteTask = async (id) => {
    try {
      await ipcRenderer.invoke('delete-event', id);
      setTasksByDate(prev => ({
        ...prev,
        [selectedDate]: (prev[selectedDate] || []).filter(task => task.id !== id)
      }));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  // filter and order tasks from the selected day
  const currentTasksUnsorted = (selectedDate && tasksByDate[selectedDate]) ? tasksByDate[selectedDate] : [];

  const currentTasks = [...currentTasksUnsorted].sort((a, b) => {
    if (!a.time && b.time) return 1;
    if (a.time && !b.time) return -1;
    if (a.time && b.time) return a.time.localeCompare(b.time);
    return 0;
  });

  // function to add especial classes to days
  const getTileClassName = ({ date: tileDate, view }) => {
    if (view === 'month') {
      const today = new Date();
      const isToday = tileDate.getDate() === today.getDate() &&
                      tileDate.getMonth() === today.getMonth() &&
                      tileDate.getFullYear() === today.getFullYear();

      let classes = "";
      
      // if it's today, add "is-today"
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

  // complete button
  const toggleComplete = async (id) => {
    const dayTasks = tasksByDate[selectedDate] || [];
    const taskToUpdate = dayTasks.find(t => t.id === id);
    
    if (!taskToUpdate) return;

    const newStatus = !taskToUpdate.completed;

    try {
      await ipcRenderer.invoke('update-event', {
        id: id,
        data: { completed: newStatus }
      });

      // update state creating a new object
      setTasksByDate(prev => {
        const newTasksByDate = { ...prev };
        newTasksByDate[selectedDate] = prev[selectedDate].map(t =>
          t.id === id ? { ...t, completed: newStatus } : t
        );
        return newTasksByDate;
      });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  // function to format date (EN: MM-DD-YYYY | PT: DD-MM-YYYY)
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    
    if (i18n.language && i18n.language.startsWith('en')) {
      return `${month}-${day}-${year}`; // US
    }
    
    return `${day}-${month}-${year}`; // PT+
  };

  return (
    <div className="app-container">
    {/* superior bar (draggable) */}
    <div className="flex justify-between items-center mb-6">
      <div className="main-title" style={{ WebkitAppRegion: 'drag' }}>hammy's den &lt;3</div>
      {/* buttons min&close (not draggable) */}
      <div className="flex gap-1" style={{ WebkitAppRegion: 'no-drag' }}>

          {/* settings button */}
          <button className="min-close-buttons settings-top-btn" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="settings-icon" />
          </button>

          <button className="min-close-buttons" onClick={minimizeApp}>_</button>
          <button className="min-close-buttons" onClick={closeApp}>x</button>
      </div>
    </div>
    <div className="base-background"></div>

    <h2 className="page-title">{t('calendar.tittle')}</h2>

    {/* page: monthly view */}
    {view === "calendar" ? (
      <>
        <div className="calendar-main-box">
          <LibCalendar 
            onChange={setDate} 
            value={date}
            tileClassName={getTileClassName}
            locale="en-US" // week starts on sunday
            formatShortWeekday={(locale, date) => date.toLocaleString(i18n.language, { weekday: 'short' }).charAt(0).toUpperCase()}
            navigationLabel={({ date }) => (
              <div className="calendar-title-container">
                <span className="calendar-title-month">
                  {date.toLocaleString(i18n.language, { month: 'long' }).toUpperCase()}
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
          <button onClick={onBack} className="button-center1">{t('calendar.menu')}</button>
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
            placeholder={t('calendar.placeholder')}
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
        <button onClick={() => setView("calendar")} className="button-center1">{t('calendar.back')}</button>
      </div>
      </>
    )}
      {isModalOpen && (
        <ExitModal 
          onCancel={() => setIsModalOpen(false)} 
          onLogout={handleLogout} 
          onExit={handleExit} 
        />
      )}
      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal onCancel={() => setIsSettingsOpen(false)}
        isLoggedIn={true}
        userId={user}
        setUser={setUser}
        />
      )}
    </div>
  );
};

export default CalendarPage;