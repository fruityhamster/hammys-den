function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li style={{ textDecoration: task.done ? "line-through" : "none" }}>
      {task.text}
      <button onClick={onToggle}>✔️</button>
      <button onClick={onDelete}>🗑️</button>
    </li>
  );
}

export default TaskItem;