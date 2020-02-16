import React, { useEffect, useState } from 'react';

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  async function getTodos() {
    const result = await fetch("/api/todos");
    const todos = await result.json();
    setTodos(todos);
  }

  async function createTodo(e) {
    e.preventDefault();
    await fetch('/api/todos', {
      method: "POST",
      body: JSON.stringify({ name: todo })
    })
    setTodo("");
    await getTodos();
  }

  async function updateCompleted(todo, isComplete) {
    await fetch(`/api/todos/${todo.id}`, {
      method: "POST",
      body: JSON.stringify({ ...todo, isComplete: isComplete })
    });
  }

  async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE"
    });
    await getTodos();
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={createTodo}>
          <input className="new-todo" placeholder="What needs to be done?" value={todo} onChange={(e) => setTodo(e.target.value)} />
        </form>
      </header>
      <section className="main" style={{ display: "block" }}>
        <input className="toggle-all" id="toggle-all" type="checkbox" />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todos.map(todo => {
            return (
              <li className={todo.IsComplete ? "completed" : ""} key={todo.id}>
                <div className="view">
                  <input className="toggle" type="checkbox" defaultChecked={todo.isComplete} onChange={(e) => updateCompleted(todo, e.target.checked)} />
                  <label>{todo.name}</label>
                  <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </section >
  );
}

export default App;