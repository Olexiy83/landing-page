
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Get products from Python backend
app.get('/api/products', (req, res) => {
  const py = spawn('python3', ['../python-backend/app.py', 'products']);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error parsing products' });
    }
  });
});

// Cart endpoints (add, remove, get)
app.post('/api/cart', (req, res) => {
  const py = spawn('python3', ['../python-backend/app.py', 'add_cart', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    res.json({ success: true, data });
  });
});

app.get('/api/cart', (req, res) => {
  const py = spawn('python3', ['../python-backend/app.py', 'get_cart']);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error parsing cart' });
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Node.js API server running on port ${PORT}`));
