import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTodoList,
  addTodo,
  sortTodo,
  updateTodo,
  toggleCompleted,
} from "../ToDoSlice";
import { TiPencil } from "react-icons/ti";
import { BsTrash } from "react-icons/bs";
import empty from "../assets/empty1.jpg";

const ToDoList = () => {
  const dispatch = useDispatch();
  const todoList = useSelector((state) => state.todo.todoList);
  const sortCriteria = useSelector((state) => state.todo.sortCriteria);
  const [showModal, setShowModal] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (todoList.length > 0) {
      localStorage.setItem("todoList", JSON.stringify(todoList));
    }
  }, [todoList]);

  useEffect(() => {
    const localTodoList = JSON.parse(localStorage.getItem("todoList"));
    if (localTodoList) {
      dispatch(setTodoList(localTodoList));
    }
  }, [dispatch]);

  const handleAddToDo = (task) => {
    if (task.trim().length === 0) {
      alert("Please enter a task");
    } else {
      dispatch(
        addTodo({
          task: task,
          id: Date.now(),
        })
      );
      setNewTask("");
      setShowModal(false);
    }
  };

  const handleUpdateToDoList = (id, task) => {
    if (task.trim().length === 0) {
      alert("Please enter a task");
    } else {
      dispatch(
        updateTodo({
          task: task,
          id: id,
        })
      );
      setNewTask("");
      setShowModal(false);
      setCurrentTodo(null);
    }
  };

  const handleDeleteToDo = (id) => {
    const updatedToDoList = todoList.filter((todo) => todo.id !== id);
    dispatch(setTodoList(updatedToDoList));
    localStorage.setItem("todoList", JSON.stringify(updatedToDoList));
  };

  const handleSort = (sortCriteria) => {
    dispatch(sortTodo(sortCriteria));
  };

  const sortedToDoList = todoList.filter((todo) => {
    if (sortCriteria === "All") return true;
    if (sortCriteria === "Completed" && todo.completed) return true;
    if (sortCriteria === "Not Completed" && !todo.completed) return true;
    return false;
  });

  const handleToggleCompleted = (id) => {
    dispatch(toggleCompleted({ id }));
  };

  return (
    <div>
      {showModal && (
        <div className="fixed w-full left-0 top-0 h-full bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md">
            <input
              type="text"
              className="w-full border p-2 rounded-md outline-none mb-8"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder={
                currentTodo ? "Update your Task here" : "Enter your task here"
              }
            />
            <div className="flex gap-10">
              {currentTodo ? (
                <>
                  <button
                    onClick={() =>
                      handleUpdateToDoList(currentTodo.id, newTask)
                    }
                    className="bg-blue-500 rounded-md text-white py-3 px-10"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setCurrentTodo(null);
                      setNewTask("");
                    }}
                    className="bg-pink-500 rounded-md text-white py-3 px-10"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setNewTask("");
                    }}
                    className="bg-blue-500 rounded-md text-white py-3 px-10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddToDo(newTask)}
                    className="bg-pink-500 rounded-md text-white py-3 px-10"
                  >
                    Add
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center flex-col">
        {todoList.length === 0 ? (
          <>
            <div className="mb-8">
              <div className="sm:w-[500px] sm:h-[500px] min-w-[250px]">
                <img src={empty} alt="No tasks" />
              </div>
              <p className="text-center text-gray-600">
                You have no todo's. Please add one.
              </p>
            </div>
          </>
        ) : (
          <div className="container mx-auto mt-6">
            <div>
              {sortedToDoList.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between mb-6 bg-slate-900 cursor-pointer text-slate-100 mx-auto w-full md:w-[75%] rounded-md p-4"
                >
                  <div
                    className={`${todo.completed ? "line-through" : ""}`}
                    onClick={() => handleToggleCompleted(todo.id)}
                  >
                    {todo.task}
                  </div>
                  <div>
                    <button
                      className="bg-blue-500 text-white p-1 rounded-md ml-2"
                      onClick={() => {
                        setShowModal(true);
                        setCurrentTodo(todo);
                        setNewTask(todo.task);
                      }}
                    >
                      <TiPencil />
                    </button>
                    <button
                      className="bg-pink-600 text-white p-1 rounded-md ml-2"
                      onClick={() => handleDeleteToDo(todo.id)}
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-center text-white py-3 px-10 rounded-md"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default ToDoList;
