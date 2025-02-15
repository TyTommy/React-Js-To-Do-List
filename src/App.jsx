import "./index.css";
import Heading from "./components/Heading";
import ToDoList from "./components/ToDoList";

function App() {
  return (
    <>
      <div className="App container py-16 px-6 min-h-screen mx-auto">
        <Heading />
        <ToDoList />
      </div>
    </>
  );
}

export default App;
