import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de logging
const LOG_LEVEL = process.env.LOG_LEVEL || 'INFO'; // INFO, ERROR, NONE
const ENABLE_LOGS = LOG_LEVEL !== 'NONE';
const ENABLE_DEBUG_LOGS = LOG_LEVEL === 'DEBUG';

// Funciones de logging personalizadas
const log = {
  info: (message, ...args) => {
    if (ENABLE_LOGS && (LOG_LEVEL === 'INFO' || LOG_LEVEL === 'DEBUG')) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  error: (message, ...args) => {
    if (ENABLE_LOGS) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  debug: (message, ...args) => {
    if (ENABLE_DEBUG_LOGS) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
};

log.info('Setting up routes...');

// User registration endpoint
app.post('/api/register', (req, res) => {
  log.debug('Register endpoint called with:', req.body);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'register', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      log.debug('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      log.error('Error processing registration');
      res.status(500).json({ error: 'Error processing registration' });
    }
  });
});

// User login endpoint
app.post('/api/login', (req, res) => {
  log.debug('Login endpoint called with:', req.body);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'login', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      log.debug('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      log.error('Error processing login');
      res.status(500).json({ error: 'Error processing login' });
    }
  });
});

// Update user profile endpoint
app.put('/api/update-profile', (req, res) => {
  log.debug('Update profile endpoint called with:', req.body);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'update_profile', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      log.debug('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      log.error('Error processing profile update');
      res.status(500).json({ error: 'Error processing profile update' });
    }
  });
});

// Get all users endpoint (Admin only)
app.get('/api/users', (req, res) => {
  log.debug('Get all users endpoint called');
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'get_users']);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      log.debug('Python response for users:', data);
      res.json(JSON.parse(data));
    } catch {
      log.error('Error processing users request');
      res.status(500).json({ error: 'Error processing users request' });
    }
  });
});

// Update user by admin endpoint
app.put('/api/update-user', (req, res) => {
  log.debug('Update user by admin endpoint called with:', req.body);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'update_user_admin', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      log.debug('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      log.error('Error processing user update');
      res.status(500).json({ error: 'Error processing user update' });
    }
  });
});

// Delete user endpoint
app.delete('/api/delete-user/:userId', (req, res) => {
  log.debug('Delete user endpoint called for user ID:', req.params.userId);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'delete_user', req.params.userId]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      log.debug('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      log.error('Error processing user deletion');
      res.status(500).json({ error: 'Error processing user deletion' });
    }
  });
});

// Get products from Python backend
app.get('/api/products', (req, res) => {
  log.debug('Products endpoint called');
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'products']);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      log.debug('Python response for products:', data);
      res.json(JSON.parse(data));
    } catch {
      log.error('Error parsing products');
      res.status(500).json({ error: 'Error parsing products' });
    }
  });
});

// Add product endpoint
app.post('/api/products', (req, res) => {
  log.debug('Add product endpoint called with:', req.body);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'add_product', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      log.debug('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      log.error('Error processing product addition');
      res.status(500).json({ error: 'Error processing product addition' });
    }
  });
});

// Update product endpoint
app.put('/api/products/:productId', (req, res) => {
  log.debug('Update product endpoint called for product ID:', req.params.productId, 'with:', req.body);
  const requestData = { ...req.body, productId: req.params.productId };
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'update_product', JSON.stringify(requestData)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      log.debug('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      log.error('Error processing product update');
      res.status(500).json({ error: 'Error processing product update' });
    }
  });
});

// Delete product endpoint
app.delete('/api/products/:productId', (req, res) => {
  log.debug('Delete product endpoint called for product ID:', req.params.productId);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'delete_product', req.params.productId]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      log.debug('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      log.error('Error processing product deletion');
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
  log.debug('Save contact message endpoint called with:', req.body);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'save_contact_message', JSON.stringify(req.body)]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      log.debug('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      log.error('Error saving contact message');
      res.status(500).json({ error: 'Error saving contact message' });
    }
  });
});

app.get('/api/contact-messages', (req, res) => {
  log.debug('Get contact messages endpoint called');
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'get_contact_messages']);
  let data = '';
  let errorData = '';
  
  py.stdout.on('data', (chunk) => {
    log.debug('Python stdout chunk:', chunk.toString());
    data += chunk;
  });
  
  py.stderr.on('data', (chunk) => {
    log.debug('Python stderr chunk:', chunk.toString());
    errorData += chunk;
  });
  
  py.on('close', (code) => {
    log.debug('Python process closed with code:', code);
    log.debug('Python stdout data:', data);
    log.debug('Python stderr data:', errorData);
    
    try {
      if (data.trim()) {
        const result = JSON.parse(data);
        log.debug('Parsed Python response:', result);
        res.json(result);
      } else {
        log.error('No data received from Python script');
        res.status(500).json({ error: 'No data received from Python script' });
      }
    } catch (parseError) {
      log.error('JSON parse error:', parseError);
      log.error('Raw data:', data);
      res.status(500).json({ error: 'Error parsing Python response' });
    }
  });
});

app.put('/api/contact-message/:messageId/status', (req, res) => {
  log.debug('Update message status endpoint called for message ID:', req.params.messageId, 'Status:', req.body.status);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'update_message_status', req.params.messageId, req.body.status]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      log.debug('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      log.error('Error updating message status');
      res.status(500).json({ error: 'Error updating message status' });
    }
  });
});

app.delete('/api/contact-message/:messageId', (req, res) => {
  log.debug('Delete contact message endpoint called for message ID:', req.params.messageId);
  const py = spawn('python3', ['/home/olexiy/work_directory/landing-page/python-backend/app.py', 'delete_contact_message', req.params.messageId]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', () => {
    try {
      log.debug('Python response:', data);
      res.json(JSON.parse(data));
    } catch {
      log.error('Error deleting contact message');
      res.status(500).json({ error: 'Error deleting contact message' });
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  log.info(`Node.js API server running on port ${PORT}`);
  log.info('Available routes:');
  log.info('POST /api/register');
  log.info('POST /api/login'); 
  log.info('PUT /api/update-profile');
  log.info('GET /api/products');
  log.info('POST /api/products');
  log.info('PUT /api/products/:productId');
  log.info('DELETE /api/products/:productId');
  log.info('GET /api/users');
  log.info('PUT /api/update-user');
  log.info('DELETE /api/delete-user/:userId');
  log.info('POST /api/contact-message');
  log.info('GET /api/contact-messages');
  log.info('PUT /api/contact-message/:messageId/status');
  log.info('DELETE /api/contact-message/:messageId');
  log.info('');
  log.info('Logging configuration:');
  log.info(`LOG_LEVEL: ${LOG_LEVEL}`);
  log.info('Available levels: NONE (no logs), ERROR (only errors), INFO (startup + errors), DEBUG (all logs)');
  log.info('To change log level: LOG_LEVEL=ERROR node server/index.js');
});
