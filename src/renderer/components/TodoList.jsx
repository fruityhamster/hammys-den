// src/renderer/components/TodoList.jsx
import React, { useState } from 'react';
import seedImg from '../assets/dashboard-almond.png';

// O componente recebe 'onBack' como propriedade para o botão home funcionar
const TodoList = ({ onBack }) => {
  // Estado para controlar o que o utilizador escreve no input
  const [taskInput, setTaskInput] = useState('');
  
  // Estado para guardar a lista de tarefas (começa vazia como na imagem)
  const [tasks, setTasks] = useState([]);

  // Função para adicionar uma nova semente (tarefa)
  const addNewSeed = () => {
    if (taskInput.trim()) {
      // Cria uma nova semente/tarefa
      const newSeed = {
        id: Date.now(),
        text: taskInput,
        germinated: false // 'completed' no contexto do Hammy
      };
      // Adiciona à lista
      setTasks([...tasks, newSeed]);
      // Limpa o input
      setTaskInput('');
    }
  };

  // Função para alternar o estado de concluído (riscar)
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Função para apagar a tarefa
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