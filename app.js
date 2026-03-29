const express = require('express');
const app = express();

app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All – Read
app.get('/todos', (req, res) => {
  return res.status(200).json(todos);
});

// ✅ GET Single Todo
app.get('/todos/:id', (req, res) => {
  const id = Number(req.params.id); // safer than parseInt
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  return res.status(200).json(todo);
});

// POST New – Create
app.post('/todos', (req, res) => {
  const { task } = req.body || {};

  // ✅ Validation
  if (!task || typeof task !== 'string') {
    return res.status(400).json({ message: 'Task is required' });
  }

  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1, // safer ID
    task,
    completed: false,
  };

  todos.push(newTodo);
  return res.status(201).json(newTodo);
});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  Object.assign(todo, req.body);
  return res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const initialLength = todos.length;

  todos = todos.filter((t) => t.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Not found' });
  }

  return res.status(204).send();
});

// GET Completed
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  return res.json(completed);
});

// ✅ ACTIVE TODOS (bonus)
app.get('/todos/active', (req, res) => {
  const active = todos.filter((t) => !t.completed);
  return res.json(active);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err); // helps debugging
  return res.status(500).json({ error: 'Server error!' });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});