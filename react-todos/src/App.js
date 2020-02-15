import React, { Fragment, useEffect, useState } from 'react';

function App() {
  const [todoForm, setTodoForm] = useState({});
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
    setTodoForm({});
    setShouldReload({});
  }

  async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE"
    });
    setShouldReload({});
  }

  function updateTodoForm(key, value) {
    setTodoForm({ ...todoForm, [key]: value });
  }

  function submitTodoForm(event) {
    event.preventDefault();
    if (todoForm.id && todoForm.name)
      createTodo({ id: todoForm.id, name: todoForm.name, isComplete: false });
  }

  useEffect(() => {
    getTodos();
  }, [shouldReload]);

  return (
    <Fragment>
      <form onSubmit={submitTodoForm}>
        <h3>New Todo</h3>
        <input placeholder="Id" type="number" value={todoForm.id || ""} onChange={(e) => updateTodoForm("id", e.target.valueAsNumber)} />
        <input placeholder="Name" type="text" value={todoForm.name || ""} onChange={(e) => updateTodoForm("name", e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      <h3>Todo List</h3>
      {todos.map(todo => {
        return (
          <div key={todo.id}>
            <label><input type="checkbox" defaultChecked={todo.isComplete} onChange={(e) => updateCompleted(todo, e.target.checked)} />{todo.name} </label>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        );
      })}
    </Fragment>
  );
}

export default App;