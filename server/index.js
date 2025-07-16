
import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';

const app = express();
app.use(cors());
app.use(express.json());

console.log('Setting up routes...');

// User registration endpoint
app.post('/api/register', (req, res) => {
  console.log('Register endpoint called with:', req.body);
  const py = spawn('python3', ['python-backend/app.py', 'register', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      console.log('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error processing registration' });
    }
  });
});

// User login endpoint
app.post('/api/login', (req, res) => {
  console.log('Login endpoint called with:', req.body);
  const py = spawn('python3', ['python-backend/app.py', 'login', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      console.log('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error processing login' });
    }
  });
});

// Update user profile endpoint
app.put('/api/update-profile', (req, res) => {
  console.log('Update profile endpoint called with:', req.body);
  const py = spawn('python3', ['python-backend/app.py', 'update_profile', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      console.log('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error processing profile update' });
    }
  });
});

// Get all users endpoint (Admin only)
app.get('/api/users', (req, res) => {
  console.log('Get all users endpoint called');
  const py = spawn('python3', ['python-backend/app.py', 'get_users']);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      console.log('Python response for users:', data);
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error processing users request' });
    }
  });
});

// Update user by admin endpoint
app.put('/api/update-user', (req, res) => {
  console.log('Update user by admin endpoint called with:', req.body);
  const py = spawn('python3', ['python-backend/app.py', 'update_user_admin', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      console.log('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error processing user update' });
    }
  });
});

// Delete user endpoint
app.delete('/api/delete-user/:userId', (req, res) => {
  console.log('Delete user endpoint called for user ID:', req.params.userId);
  const py = spawn('python3', ['python-backend/app.py', 'delete_user', req.params.userId]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      console.log('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error processing user deletion' });
    }
  });
});

// Get products from Python backend
app.get('/api/products', (req, res) => {
  console.log('Products endpoint called');
  const py = spawn('python3', ['python-backend/app.py', 'products']);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      console.log('Python response for products:', data);
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
app.listen(PORT, () => {
  console.log(`Node.js API server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('POST /api/register');
  console.log('POST /api/login'); 
  console.log('PUT /api/update-profile');
  console.log('GET /api/products');
  console.log('GET /api/users');
  console.log('PUT /api/update-user');
  console.log('DELETE /api/delete-user/:userId');
});
