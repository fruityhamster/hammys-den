import TodoList from "../components/TodoList";
import Timer from "../components/Timer";
import MyCalendar from "../components/Calendar";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Aplicação de Produtividade</h1>
      <TodoList />
      <Timer />
      <MyCalendar />
    </div>
  );
}

export default App;