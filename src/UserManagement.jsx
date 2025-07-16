import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Edit,
  Delete,
  ArrowBack,
  Add,
  Person,
  Email,
  Badge,
  AdminPanelSettings
} from '@mui/icons-material';

function UserManagement({ onBack, user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    docType: 'DNI',
    docValue: '',
    isAdmin: false
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/users');
      if (!response.ok) {
        throw new Error('Error fetching users');
      }
      const usersData = await response.json();
      setUsers(usersData);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar usuarios. Asegúrese de que el servidor esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (userToEdit) => {
    setSelectedUser(userToEdit);
    setEditForm({
      name: userToEdit.name || '',
      email: userToEdit.email || '',
      docType: userToEdit.docType || 'DNI',
      docValue: userToEdit.docValue || '',
      isAdmin: userToEdit.email === 'admin' || userToEdit.isAdmin || false
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (userToDelete) => {
    setSelectedUser(userToDelete);
    setDeleteDialogOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          ...editForm
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSnackbarMessage('Usuario actualizado exitosamente');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setEditDialogOpen(false);
        fetchUsers(); // Refresh the users list
      } else {
        setSnackbarMessage('Error al actualizar usuario: ' + (result.error || 'Error desconocido'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error de conexión al actualizar usuario');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/delete-user/${selectedUser.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSnackbarMessage('Usuario eliminado exitosamente');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setDeleteDialogOpen(false);
        fetchUsers(); // Refresh the users list
      } else {
        setSnackbarMessage('Error al eliminar usuario: ' + (result.error || 'Error desconocido'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error de conexión al eliminar usuario');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const isCurrentUser = (userToCheck) => {
    return userToCheck.id === user.id;
  };

  const isAdminUser = (userToCheck) => {
    return userToCheck.email === 'admin' || userToCheck.isAdmin;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography variant="h6">Cargando usuarios...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#f5f6fa', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* AppBar superior igual a la de login */}
      <AppBar position="static" color="primary" elevation={2} sx={{ width: '100vw', borderRadius: 0 }}>
        <Toolbar sx={{ 
          width: '100%', 
          minHeight: 72, 
          maxWidth: '100vw', 
          mx: 'auto', 
          px: 4, 
          display: 'flex', 
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="volver"
              onClick={onBack}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, mr: 2 }}>
              Librería
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, ml: 2 }}>
            <AdminPanelSettings sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Administración de Usuarios
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content - Centrado como en la página de login */}
      <Box sx={{ mt: 4, width: '90%', maxWidth: '1200px' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
              Lista de Usuarios ({users.length})
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Documento</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Fecha Registro</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((userRow) => (
                  <TableRow key={userRow.id} hover>
                    <TableCell>{userRow.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, color: '#666' }} />
                        {userRow.name}
                        {isCurrentUser(userRow) && (
                          <Chip 
                            label="Tú" 
                            size="small" 
                            color="primary" 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Email sx={{ mr: 1, color: '#666' }} />
                        {userRow.email}
                        {isAdminUser(userRow) && (
                          <Chip 
                            label="Admin" 
                            size="small" 
                            color="secondary" 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{userRow.docValue}</TableCell>
                    <TableCell>
                      <Chip 
                        label={userRow.docType} 
                        size="small" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(userRow.created_at).toLocaleDateString('es-AR')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Editar usuario">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditClick(userRow)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        {!isCurrentUser(userRow) && (
                          <Tooltip title="Eliminar usuario">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(userRow)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Edit sx={{ mr: 1 }} />
            Editar Usuario
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre completo"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Correo electrónico"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  fullWidth
                  required
                  type="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Tipo de documento"
                  name="docType"
                  value={editForm.docType}
                  onChange={handleEditFormChange}
                  fullWidth
                  required
                >
                  <MenuItem value="DNI">DNI</MenuItem>
                  <MenuItem value="CUIT">CUIT</MenuItem>
                  <MenuItem value="CUIL">CUIL</MenuItem>
                  <MenuItem value="CI">CI</MenuItem>
                  <MenuItem value="LE">LE</MenuItem>
                  <MenuItem value="LC">LC</MenuItem>
                  <MenuItem value="Pasaporte">Pasaporte, otro</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Número de documento"
                  name="docValue"
                  value={editForm.docValue}
                  onChange={handleEditFormChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar al usuario "{selectedUser?.name}"? 
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserManagement;
