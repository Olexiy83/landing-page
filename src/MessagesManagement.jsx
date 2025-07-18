import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Alert,
  Grid,
  TablePagination
} from '@mui/material';
import { ArrowBack, Email, Delete, Visibility, Person, Phone, Message, Refresh, Edit } from '@mui/icons-material';

function MessagesManagement({ onBack, user }) {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/contact-messages');
      const result = await response.json();
      
      if (result.success) {
        setMessages(result.messages);
      } else {
        console.error('Error al cargar mensajes:', result.error);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error de conexión al cargar mensajes:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar mensajes desde la base de datos
  useEffect(() => {
    fetchMessages();
    
    // Recargar mensajes cada 30 segundos para mantener la lista actualizada
    const interval = setInterval(fetchMessages, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMessage(null);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/contact-message/${messageId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Actualizar la lista inmediatamente
        setMessages(messages.filter(msg => msg.id !== messageId));
        // También recargar desde el servidor para asegurar sincronización
        setTimeout(fetchMessages, 500);
      } else {
        console.error('Error al eliminar mensaje:', result.error);
        alert('Error al eliminar el mensaje');
      }
    } catch (error) {
      console.error('Error de conexión al eliminar mensaje:', error);
      // Mantener funcionalidad local como fallback
      setMessages(messages.filter(msg => msg.id !== messageId));
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/contact-message/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'leído' })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Actualizar la lista inmediatamente
        setMessages(messages.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: 'leído' }
            : msg
        ));
        // También recargar desde el servidor para asegurar sincronización
        setTimeout(fetchMessages, 500);
      } else {
        console.error('Error al actualizar estado:', result.error);
        alert('Error al actualizar el estado del mensaje');
      }
    } catch (error) {
      console.error('Error de conexión al actualizar estado:', error);
      // Mantener funcionalidad local como fallback
      setMessages(messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'leído' }
          : msg
      ));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'nuevo': return 'error';
      case 'leído': return 'warning';
      case 'respondido': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'nuevo': return 'Nuevo';
      case 'leído': return 'Leído';
      case 'respondido': return 'Respondido';
      default: return status;
    }
  };

  // Funciones para paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calcular mensajes para la página actual
  const paginatedMessages = messages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#f5f6fa', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#2c3e50' }}>
            Gestión de Mensajes
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Actualización automática cada 30s
          </Typography>
          <IconButton 
            onClick={fetchMessages} 
            disabled={loading}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&:disabled': { bgcolor: 'grey.300' }
            }}
          >
            <Refresh sx={{ 
              animation: loading ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
          </IconButton>
        </Box>
      </Box>

      {/* Messages Table */}
      <Paper sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50' }}>
            Lista de Mensajes ({messages.length})
          </Typography>
        </Box>
        
        {messages.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>
            No hay mensajes de contacto para mostrar.
          </Alert>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Teléfono</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Asunto</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedMessages.map((message, index) => (
                  <TableRow 
                    key={message.id}
                    sx={{ 
                      '&:hover': { bgcolor: '#f8f9fa' },
                      '&:nth-of-type(even)': { bgcolor: '#fafafa' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, color: '#666', fontSize: '1.2rem' }} />
                        {message.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Email sx={{ mr: 1, color: '#666', fontSize: '1rem' }} />
                        {message.email}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {message.phone ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Phone sx={{ mr: 1, color: '#666', fontSize: '1rem' }} />
                          {message.phone}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {message.subject}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusText(message.status)}
                        color={getStatusColor(message.status)}
                        size="small"
                        sx={{ minWidth: 80 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {message.date}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {message.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewMessage(message)}
                          sx={{ 
                            color: '#2196f3',
                            '&:hover': { bgcolor: '#e3f2fd' }
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        {message.status === 'nuevo' && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleMarkAsRead(message.id)}
                            sx={{ 
                              color: '#ff9800',
                              '&:hover': { bgcolor: '#fff3e0' }
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteMessage(message.id)}
                          sx={{ 
                            color: '#f44336',
                            '&:hover': { bgcolor: '#ffebee' }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Paginación */}
            <TablePagination
              component="div"
              count={messages.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[20, 40, 60]}
              labelRowsPerPage="Mensajes por página:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
              }
              sx={{
                borderTop: '1px solid #e0e0e0',
                '& .MuiTablePagination-toolbar': {
                  px: 2,
                  py: 1
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontSize: '0.875rem',
                  color: 'text.secondary'
                }
              }}
            />
          </>
        )}
      </Paper>      {/* Message Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Detalle del Mensaje</Typography>
            <Chip 
              label={selectedMessage ? getStatusText(selectedMessage.status) : ''}
              color={selectedMessage ? getStatusColor(selectedMessage.status) : 'default'}
              size="small"
            />
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedMessage && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={{ mr: 1, color: '#666' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {selectedMessage.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={{ mr: 1, color: '#666' }} />
                    <Typography variant="body2">
                      {selectedMessage.email}
                    </Typography>
                  </Box>

                  {selectedMessage.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Phone sx={{ mr: 1, color: '#666' }} />
                      <Typography variant="body2">
                        {selectedMessage.phone}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha: {selectedMessage.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hora: {selectedMessage.time}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Asunto:
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedMessage.subject}
              </Typography>

              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Mensaje:
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {selectedMessage.message}
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          {selectedMessage && selectedMessage.status === 'nuevo' && (
            <Button 
              onClick={() => {
                handleMarkAsRead(selectedMessage.id);
                handleCloseDialog();
              }}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Marcar como Leído
            </Button>
          )}
          <Button onClick={handleCloseDialog} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MessagesManagement;
