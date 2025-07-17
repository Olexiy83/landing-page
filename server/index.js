import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtener el directorio actual del servidor
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar rutas relativas
const PYTHON_SCRIPT_PATH = process.env.PYTHON_SCRIPT_PATH || join(__dirname, '..', 'python-backend', 'app.py');
const PYTHON_EXECUTABLE = process.env.PYTHON_EXECUTABLE || 'python3';

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

// Función helper para ejecutar scripts de Python
const executePythonScript = (command, args = [], callback) => {
  const scriptArgs = [PYTHON_SCRIPT_PATH, command];
  if (args.length > 0) {
    scriptArgs.push(...args);
  }
  
  log.debug(`Executing: ${PYTHON_EXECUTABLE} ${scriptArgs.join(' ')}`);
  const py = spawn(PYTHON_EXECUTABLE, scriptArgs);
  
  let data = '';
  let errorData = '';
  
  py.stdout.on('data', (chunk) => (data += chunk));
  py.stderr.on('data', (chunk) => (errorData += chunk));
  
  py.on('close', (code) => {
    if (code !== 0) {
      log.error(`Python script exited with code ${code}. Error: ${errorData}`);
      callback(new Error(`Python script failed: ${errorData}`), null);
    } else {
      try {
        log.debug('Python response:', data);
        callback(null, JSON.parse(data));
      } catch (parseError) {
        log.error('Error parsing Python response:', parseError);
        callback(new Error('Invalid JSON response from Python script'), null);
      }
    }
  });
  
  py.on('error', (error) => {
    log.error('Error spawning Python process:', error);
    callback(error, null);
  });
};

log.info('Setting up routes...');

// User registration endpoint
app.post('/api/register', (req, res) => {
  log.debug('Register endpoint called with:', req.body);
  executePythonScript('register', [JSON.stringify(req.body)], (error, result) => {
    if (error) {
      log.error('Error processing registration:', error.message);
      res.status(500).json({ error: 'Error processing registration' });
    } else {
      res.json(result);
    }
  });
});

// User login endpoint
app.post('/api/login', (req, res) => {
  log.debug('Login endpoint called with:', req.body);
  executePythonScript('login', [JSON.stringify(req.body)], (error, result) => {
    if (error) {
      log.error('Error processing login:', error.message);
      res.status(500).json({ error: 'Error processing login' });
    } else {
      res.json(result);
    }
  });
});

// Update user profile endpoint
app.put('/api/update-profile', (req, res) => {
  log.debug('Update profile endpoint called with:', req.body);
  executePythonScript('update_profile', [JSON.stringify(req.body)], (error, result) => {
    if (error) {
      log.error('Error processing profile update:', error.message);
      res.status(500).json({ error: 'Error processing profile update' });
    } else {
      res.json(result);
    }
  });
});

// Get all users endpoint (Admin only)
app.get('/api/users', (req, res) => {
  log.debug('Get all users endpoint called');
  executePythonScript('get_users', [], (error, result) => {
    if (error) {
      log.error('Error processing users request:', error.message);
      res.status(500).json({ error: 'Error processing users request' });
    } else {
      res.json(result);
    }
  });
});

// Update user by admin endpoint
app.put('/api/update-user', (req, res) => {
  log.debug('Update user by admin endpoint called with:', req.body);
  executePythonScript('update_user_admin', [JSON.stringify(req.body)], (error, result) => {
    if (error) {
      log.error('Error processing user update:', error.message);
      res.status(500).json({ error: 'Error processing user update' });
    } else {
      res.json(result);
    }
  });
});

// Delete user endpoint
app.delete('/api/delete-user/:userId', (req, res) => {
  log.debug('Delete user endpoint called for user ID:', req.params.userId);
  executePythonScript('delete_user', [req.params.userId], (error, result) => {
    if (error) {
      log.error('Error processing user deletion:', error.message);
      res.status(500).json({ error: 'Error processing user deletion' });
    } else {
      res.json(result);
    }
  });
});

// Get products from Python backend
app.get('/api/products', (req, res) => {
  log.debug('Products endpoint called');
  executePythonScript('products', [], (error, result) => {
    if (error) {
      log.error('Error parsing products:', error.message);
      res.status(500).json({ error: 'Error parsing products' });
    } else {
      res.json(result);
    }
  });
});

// Add product endpoint
app.post('/api/products', (req, res) => {
  log.debug('Add product endpoint called with:', req.body);
  executePythonScript('add_product', [JSON.stringify(req.body)], (error, result) => {
    if (error) {
      log.error('Error processing product addition:', error.message);
      res.status(500).json({ error: 'Error processing product addition' });
    } else {
      res.json(result);
    }
  });
});

// Update product endpoint
app.put('/api/products/:productId', (req, res) => {
  log.debug('Update product endpoint called for product ID:', req.params.productId, 'with:', req.body);
  const requestData = { ...req.body, productId: req.params.productId };
  executePythonScript('update_product', [JSON.stringify(requestData)], (error, result) => {
    if (error) {
      log.error('Error processing product update:', error.message);
      res.status(500).json({ error: 'Error processing product update' });
    } else {
      res.json(result);
    }
  });
});

// Delete product endpoint
app.delete('/api/products/:productId', (req, res) => {
  log.debug('Delete product endpoint called for product ID:', req.params.productId);
  executePythonScript('delete_product', [req.params.productId], (error, result) => {
    if (error) {
      log.error('Error processing product deletion:', error.message);
      res.status(500).json({ error: 'Error processing product deletion' });
    } else {
      res.json(result);
    }
  });
});

// Cart endpoints (add, remove, get)
app.post('/api/cart', (req, res) => {
  executePythonScript('add_cart', [JSON.stringify(req.body)], (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Error adding to cart' });
    } else {
      res.json({ success: true, data: result });
    }
  });
});

app.get('/api/cart', (req, res) => {
  executePythonScript('get_cart', [], (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Error parsing cart' });
    } else {
      res.json(result);
    }
  });
});

// Contact message endpoints
app.post('/api/contact-message', (req, res) => {
  log.debug('Save contact message endpoint called with:', req.body);
  executePythonScript('save_contact_message', [JSON.stringify(req.body)], (error, result) => {
    if (error) {
      log.error('Error saving contact message:', error.message);
      res.status(500).json({ error: 'Error saving contact message' });
    } else {
      res.json(result);
    }
  });
});

app.get('/api/contact-messages', (req, res) => {
  log.debug('Get contact messages endpoint called');
  executePythonScript('get_contact_messages', [], (error, result) => {
    if (error) {
      log.error('Error getting contact messages:', error.message);
      res.status(500).json({ error: 'Error getting contact messages' });
    } else {
      res.json(result);
    }
  });
});

app.put('/api/contact-message/:messageId/status', (req, res) => {
  log.debug('Update message status endpoint called for message ID:', req.params.messageId, 'Status:', req.body.status);
  executePythonScript('update_message_status', [req.params.messageId, req.body.status], (error, result) => {
    if (error) {
      log.error('Error updating message status:', error.message);
      res.status(500).json({ error: 'Error updating message status' });
    } else {
      res.json(result);
    }
  });
});

app.delete('/api/contact-message/:messageId', (req, res) => {
  log.debug('Delete contact message endpoint called for message ID:', req.params.messageId);
  executePythonScript('delete_contact_message', [req.params.messageId], (error, result) => {
    if (error) {
      log.error('Error deleting contact message:', error.message);
      res.status(500).json({ error: 'Error deleting contact message' });
    } else {
      res.json(result);
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
