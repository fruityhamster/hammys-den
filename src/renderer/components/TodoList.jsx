import { useState } from "react";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim() === "") return;
    setTasks([...tasks, { text: input, done: false }]);
    setInput("");
  };

  const toggleDone = (index) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Todo List</h2>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Nova tarefa"/>
      <button onClick={addTask}>Adicionar</button>
      <ul>
        {tasks.map((task, i) => (
          <li key={i} style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
            {task.text}
            <button onClick={() => toggleDone(i)}>✔️</button>
            <button onClick={() => deleteTask(i)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;