import React, { useEffect, useState } from 'react';

function App() {
  const [todoForm, setTodoForm] = useState({ isComplete: false });
  const [todos, setTodos] = useState([]);
  const [shouldReload, setShouldReload] = useState({});

  async function getTodos() {
    const result = await fetch("/api/todos")
    result.json()
      .then(res => setTodos(res));
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
      .then(() => setTodoForm({ isComplete: false }))
      .then(() => setShouldReload({}));
  }

  async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE"
    }).then(() => setShouldReload({}));
  }

  function updateTodoForm(key, value) {
    setTodoForm({ ...todoForm, [key]: value });
  }

  function submitTodoForm(event) {
    event.preventDefault();
    createTodo(todoForm);
  }

  useEffect(() => {
    getTodos();
  }, [shouldReload]);

  return (
    <div>
      <form onSubmit={submitTodoForm}>
        <h3>New Todo</h3>
        <input placeholder="Id" type="text" value={todoForm.id || ""} onChange={(e) => updateTodoForm("id", parseInt(e.target.value))} />
        <input placeholder="Name" type="text" value={todoForm.name || ""} onChange={(e) => updateTodoForm("name", e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h3>Todo List</h3>
        {todos.map(todo => {
          return (
            <div key={todo.id}>
              <label><input type="checkbox" defaultChecked={todo.isComplete} onChange={(event) => updateCompleted(todo, event.target.value)} />{todo.name} </label>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;