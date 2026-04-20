// src/renderer/components/TodoList.jsx
import React, { useState } from 'react';
import seedImg from '../assets/dashboard-almond.png';

// the component has 'onBack' as a property so home button functions
const TodoList = ({ onBack }) => {
  // state to control what the user writes in the input
  const [taskInput, setTaskInput] = useState('');
  
  // state to save task list (starts empty)
  const [tasks, setTasks] = useState([]);

  // function to add a new task
  const addNewSeed = () => {
    if (taskInput.trim()) {
      // new task
      const newSeed = {
        id: Date.now(),
        text: taskInput,
        germinated: false // task 'not completed'
      };
      // add task to the list
      setTasks([...tasks, newSeed]);
      // cleans input
      setTaskInput('');
    }
  };

  // function to change the conclusion state (cross out)
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // function to delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
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

      {/* page title: to-do list */}
      <h2 className="page-title">to-do list</h2>

      {/* add button + input section */}
      <div className="add-input-group">
        {/* add button */}
        <button onClick={addNewSeed} className="add-button">+</button>
        
        {/* input field */}
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
          className="input-field" 
          style={{ imageRendering: 'pixelated' }}/>
          
      </div>

      {/* tasks added */}
      <div className="task-show-field">
        {/*show tasks */}
        <ul className="space-y-3 overflow-y-auto max-h-[260px]">
          {tasks.map(task => (
            <li key={task.id} className="task-item">
              {/* seed image */}
              <img src={seedImg} alt="seed" className="task-seed-icon" />
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

      {/* "home" button */}
      <div className="flex justify-center">
        <button onClick={onBack} className="button-center1">home</button>
      </div>
    </div>
  );
};

export default TodoList;