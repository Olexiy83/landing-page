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
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'register', JSON.stringify(req.body)]);
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
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'login', JSON.stringify(req.body)]);
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
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'update_profile', JSON.stringify(req.body)]);
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
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'get_users']);
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
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'update_user_admin', JSON.stringify(req.body)]);
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
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'delete_user', req.params.userId]);
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
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'products']);
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

// Add product endpoint
app.post('/api/products', (req, res) => {
  console.log('Add product endpoint called with:', req.body);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'add_product', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      console.log('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error processing product addition' });
    }
  });
});

// Update product endpoint
app.put('/api/products/:productId', (req, res) => {
  console.log('Update product endpoint called for product ID:', req.params.productId, 'with:', req.body);
  const requestData = { ...req.body, productId: req.params.productId };
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'update_product', JSON.stringify(requestData)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      console.log('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error processing product update' });
    }
  });
});

// Delete product endpoint
app.delete('/api/products/:productId', (req, res) => {
  console.log('Delete product endpoint called for product ID:', req.params.productId);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'delete_product', req.params.productId]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      console.log('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error processing product deletion' });
    }
  });
});

// Cart endpoints (add, remove, get)
app.post('/api/cart', (req, res) => {
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'add_cart', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    res.json({ success: true, data });
  });
});

app.get('/api/cart', (req, res) => {
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'get_cart']);
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

// Contact message endpoints
app.post('/api/contact-message', (req, res) => {
  console.log('Save contact message endpoint called with:', req.body);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'save_contact_message', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      console.log('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error saving contact message' });
    }
  });
});

app.get('/api/contact-messages', (req, res) => {
  console.log('Get contact messages endpoint called');
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'get_contact_messages']);
  let data = '';
  let errorData = '';
  
  py.stdout.on('data', (chunk) => {
    console.log('Python stdout chunk:', chunk.toString());
    data += chunk;
  });
  
  py.stderr.on('data', (chunk) => {
    console.log('Python stderr chunk:', chunk.toString());
    errorData += chunk;
  });
  
  py.on('close', (code) => {
    console.log('Python process closed with code:', code);
    console.log('Python stdout data:', data);
    console.log('Python stderr data:', errorData);
    
    try {
      if (data.trim()) {
        const result = JSON.parse(data);
        console.log('Parsed Python response:', result);
        res.json(result);
      } else {
        console.log('No data received from Python script');
        res.status(500).json({ error: 'No data received from Python script' });
      }
    } catch (parseError) {
      console.log('JSON parse error:', parseError);
      console.log('Raw data:', data);
      res.status(500).json({ error: 'Error parsing Python response' });
    }
  });
});

app.put('/api/contact-message/:messageId/status', (req, res) => {
  console.log('Update message status endpoint called for message ID:', req.params.messageId, 'Status:', req.body.status);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'update_message_status', req.params.messageId, req.body.status]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      console.log('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error updating message status' });
    }
  });
});

app.delete('/api/contact-message/:messageId', (req, res) => {
  console.log('Delete contact message endpoint called for message ID:', req.params.messageId);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'delete_contact_message', req.params.messageId]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      console.log('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: 'Error deleting contact message' });
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
  console.log('POST /api/products');
  console.log('PUT /api/products/:productId');
  console.log('DELETE /api/products/:productId');
  console.log('GET /api/users');
  console.log('PUT /api/update-user');
  console.log('DELETE /api/delete-user/:userId');
  console.log('POST /api/contact-message');
  console.log('GET /api/contact-messages');
  console.log('PUT /api/contact-message/:messageId/status');
  console.log('DELETE /api/contact-message/:messageId');
});
