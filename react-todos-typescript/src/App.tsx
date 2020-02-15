import React, { useEffect, useState } from 'react';

type Todo = {
  id: number;
  name: string;
  isComplete: boolean;
}

type TodoForm = {
  id?: number;
  name?: string;
  isComplete: false;
}

function App() {
  const [todoForm, setTodoForm] = useState<TodoForm>({ isComplete: false });
  const [todos, setTodos] = useState<Todo[]>([]);
  const [shouldReload, setShouldReload] = useState({});

  async function getTodos() {
    const result = await fetch("/api/todos")
    result.json()
      .then(res => setTodos(res));
  }

  async function updateCompleted(todo: Todo, isComplete: boolean) {
    await fetch(`/api/todos/${todo.id}`, {
      method: "POST",
      body: JSON.stringify({ ...todo, isComplete: isComplete })
    });
  }

  async function createTodo(todo: Todo) {
    await fetch('/api/todos', {
      method: "POST",
      body: JSON.stringify(todo)
    })
      .then(() => setTodoForm({ isComplete: false }))
      .then(() => setShouldReload({}));
  }

  async function deleteTodo(id: number) {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE"
    }).then(() => setShouldReload({}));
  }

  function updateTodoForm(key: keyof Todo, value: number | string | boolean) {
    setTodoForm({ ...todoForm, [key]: value });
  }

  function submitTodoForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (todoForm.id && todoForm.name)
      createTodo(todoForm as Todo);
  }

  useEffect(() => {
    getTodos();
  }, [shouldReload]);

  return (
    <div>
      <form onSubmit={submitTodoForm}>
        <h3>New Todo</h3>
        <input placeholder="Id" type="number" value={todoForm.id || ""} onChange={(e) => updateTodoForm("id", e.target.valueAsNumber)} />
        <input placeholder="Name" type="text" value={todoForm.name || ""} onChange={(e) => updateTodoForm("name", e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h3>Todo List</h3>
        {todos.map(todo => {
          return (
            <div key={todo.id}>
              <label><input type="checkbox" defaultChecked={todo.isComplete} onChange={(e) => updateCompleted(todo, e.target.checked)} />{todo.name} </label>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;