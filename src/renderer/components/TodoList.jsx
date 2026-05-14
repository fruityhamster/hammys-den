// src/renderer/components/TodoList.jsx
import React, { useState, useEffect } from 'react';
import seedImg from '../assets/dashboard-almond.png';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
const { ipcRenderer } = window.require('electron');

// the component has 'onBack' as a property so home button functions
const TodoList = ({ onBack, userId }) => {
  // state to control what the user writes in the input
  const [taskInput, setTaskInput] = useState('');
  // state to save task list (starts empty)
  const [tasks, setTasks] = useState([]);

  // load tasks from database
  useEffect(() => {
    async function loadTasks() {
      const dbTasks = await ipcRenderer.invoke('get-tasks', userId);
      
      // names changed
      const formattedTasks = dbTasks.map(t => ({
        id: t.id,
        text: t.title,
        completed: t.isCompleted,
        position: t.position
      }));
      
      setTasks(formattedTasks);
    }
    loadTasks();
  }, []);

  // function to add a new task
  const addNewSeed = async () => {
    if (taskInput.trim()) {
      try {
        // new task
        const newTask = await ipcRenderer.invoke('add-task', {
          title: taskInput,
          userId: userId,
          isCompleted: false,
          position: tasks.length
        });
        
        const newSeed = {
          id: newTask.id,
          text: newTask.title,
          completed: newTask.isCompleted,
          position: newTask.position
        };

        setTasks([...tasks, newSeed]);
        setTaskInput('');
      } catch (error) {
        console.error("Erro ao guardar tarefa:", error);
      }
    } 
  };

  // allows the user to order the tasks
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items); // updates the state with the new order

    // save new order
    try {
      // goes through the list looking at the positions. loop to give too each task a number 
      for (let i = 0; i < items.length; i++) {
        await ipcRenderer.invoke('update-task', {
          id: items[i].id,
          data: { position: i }
        });
      }
    } catch (error) {
      console.error("Erro ao guardar nova ordem:", error);
    }
  };

  // function to change the conclusion state (cross out)
  const toggleComplete = async (id) => {
    const taskToUpdate = tasks.find(t => t.id === id);
    const newStatus = !taskToUpdate.completed;

    try {
      await ipcRenderer.invoke('update-task', {
        id: id,
        data: { isCompleted: newStatus }
      });

      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: newStatus } : task
      ));
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  // function to delete task
  const deleteTask = async (id) => {
    try {
      await ipcRenderer.invoke('delete-task', id);

      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Erro ao apagar tarefa:", error);
    }
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
        setTimeout(() => window.close(), 150);
    };

  return (
    <div className="app-container">
      {/* superior bar (draggable) */}
      <div className="flex justify-between items-center mb-6">
        <div className="main-title" style={{ WebkitAppRegion: 'drag' }}>hammy's den &lt;3</div>
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
        <input 
          type="text"
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              // show tasks
              <ul className="space-y-3 overflow-y-auto max-h-[260px]" {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <li className="task-item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        {/* seed image */}
                        <img src={seedImg} alt="seed" className="task-seed-icon" />
                        {/* conditional class to cross out the task */}
                        <span className={`task-text ${task.completed ? 'completed' : ''}`}>{task.text}</span>
                        <div className="task-actions">
                          <button onClick={() => toggleComplete(task.id)} className="btn-check"></button>
                          <button onClick={() => deleteTask(task.id)} className="btn-delete"></button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* "home" button */}
      <div className="flex justify-center">
        <button onClick={onBack} className="button-center1">home</button>
      </div>
    </div>
  );
};

export default TodoList;