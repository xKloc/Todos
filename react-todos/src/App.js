import React, { useEffect, useState } from 'react';

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [shouldReload, setShouldReload] = useState({});

  async function getTodos() {
    const result = await fetch("/api/todos");
    const todos = await result.json();
    setTodos(todos);
  }

  async function updateCompleted(todo, isComplete) {
    await fetch(`/api/todos/${todo.id}`, {
      method: "POST",
      body: JSON.stringify({ ...todo, isComplete: isComplete })
    });
  }

  async function createTodo(todo) {
    await fetch('/api/todos', {
      method: "POST",
      body: JSON.stringify(todo)
    })
    setTodo("");
    setShouldReload({});
  }

  async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE"
    });
    setShouldReload({});
  }

  function submitTodoForm(event) {
    event.preventDefault();
    createTodo({ name: todo });
  }

  useEffect(() => {
    getTodos();
  }, [shouldReload]);

  return (
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <form onSubmit={submitTodoForm}>
          <input class="new-todo" placeholder="What needs to be done?" value={todo || ""} onChange={(e) => setTodo(e.target.value)} />
        </form>
      </header>
      <section class="main" style={{ display: "block" }}>
        <input class="toggle-all" id="toggle-all" type="checkbox" />
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          {todos.map(todo => {
            return (
              <li className={todo.IsComplete ? "completed" : ""} key={todo.id}>
                <div class="view">
                  <input class="toggle" type="checkbox" defaultChecked={todo.isComplete} onChange={(e) => updateCompleted(todo, e.target.checked)} />
                  <label>{todo.name}</label>
                  <button class="destroy" onClick={() => deleteTodo(todo.id)}></button>
                </div>
                <input class="edit" value={todo.name} />
              </li>
            );
          })}
        </ul>
      </section>
    </section >
  );
}

export default App;