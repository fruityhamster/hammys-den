/* all components imported */
import TodoList from "../components/TodoList";
import Timer from "../components/Timer";
import MyCalendar from "../components/Calendar";
/*  import Login from '../components/login';
    import Dashboard from '../components/Dashboard';
    import History from '../components/history';
*/

function App() {
  return (
    <div className={"bg-hammy-beige-dark p-4 text-hammy-brown-dark"}>
        <div style={{ padding: "20px" }}>
          <h1>Aplicação de Produtividade</h1>
          <TodoList />
          <Timer />
          <MyCalendar />
        </div>
    </div>
    
  );
}

export default App;
