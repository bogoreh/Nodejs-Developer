const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// In-memory storage for expenses
let expenses = [
  { id: 1, description: "Coffee", amount: 4.50, category: "Food", date: "2024-01-15" },
  { id: 2, description: "Gas", amount: 45.00, category: "Transportation", date: "2024-01-14" },
  { id: 3, description: "Netflix", amount: 15.99, category: "Entertainment", date: "2024-01-10" },
  { id: 4, description: "Groceries", amount: 85.75, category: "Food", date: "2024-01-12" },
  { id: 5, description: "Uber", amount: 25.50, category: "Transportation", date: "2024-01-13" }
];

let nextId = 6;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Get all expenses
app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

// Get expenses summary
app.get('/api/expenses/summary', (req, res) => {
  const { period = 'daily' } = req.query;
  
  const summary = expenses.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) {
      acc[date] = { date, total: 0, count: 0 };
    }
    acc[date].total += expense.amount;
    acc[date].count += 1;
    return acc;
  }, {});
  
  res.json(Object.values(summary));
});

// Get category breakdown
app.get('/api/expenses/categories', (req, res) => {
  const categories = {};
  
  expenses.forEach(expense => {
    if (!categories[expense.category]) {
      categories[expense.category] = 0;
    }
    categories[expense.category] += expense.amount;
  });
  
  const result = Object.entries(categories).map(([name, total]) => ({
    name,
    total: parseFloat(total.toFixed(2))
  }));
  
  res.json(result);
});

// Add new expense
app.post('/api/expenses', (req, res) => {
  const { description, amount, category, date } = req.body;
  
  if (!description || !amount || !category || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const newExpense = {
    id: nextId++,
    description,
    amount: parseFloat(amount),
    category,
    date
  };
  
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// Delete expense
app.delete('/api/expenses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = expenses.length;
  expenses = expenses.filter(expense => expense.id !== id);
  
  if (expenses.length < initialLength) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});