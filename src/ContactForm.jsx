import { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Grid, Alert, Snackbar, AppBar, Toolbar, InputBase, IconButton, Badge, Drawer, List, ListItem, ListItemText
} from '@mui/material';
import { Email, Phone, LocationOn, Send, ArrowBack, ShoppingCart, Menu as MenuIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

/*
 * Para implementar el envío real de emails, instala EmailJS:
 * npm install @emailjs/browser
 * 
 * Luego configura EmailJS:
 * 1. Regístrate en https://www.emailjs.com/
 * 2. Crea un servicio de email
 * 3. Crea una plantilla de email
 * 4. Obtén tu Public Key
 * 5. Importa: import emailjs from '@emailjs/browser';
 * 6. Reemplaza la simulación en handleSubmit con:
 *    await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailData, 'YOUR_PUBLIC_KEY');
 */

// Estilos personalizados para el buscador (mismo que en App.jsx)
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

function ContactForm({ onBack, cart = [], cartOpen = false, setCartOpen = () => {} }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es requerido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbarMessage('Por favor, corrija los errores en el formulario');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Crear el objeto con los datos del formulario para guardar en la base de datos
      const messageData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        subject: formData.subject,
        message: formData.message
      };

      console.log('Guardando mensaje en la base de datos:', messageData);
      
      // Guardar el mensaje en la base de datos
      const response = await fetch('http://localhost:3001/api/contact-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Mensaje guardado exitosamente con ID:', result.messageId);
        
        setSnackbarMessage('¡Mensaje enviado y guardado exitosamente! Te responderemos pronto.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        
        // Limpiar el formulario
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(result.error || 'Error al guardar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar/guardar el mensaje:', error);
      setSnackbarMessage('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#f5f6fa', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* AppBar superior igual que en la aplicación principal */}
      <AppBar position="static" color="primary" elevation={2} sx={{ width: '100vw', borderRadius: 0 }}>
        <Toolbar sx={{ width: '100%', minHeight: 72, maxWidth: '100vw', mx: 'auto', px: 4 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, mr: 2 }}>
            Librería
          </Typography>
          <Box sx={{ flexGrow: 0, width: 340, minWidth: 340, maxWidth: 340, display: { xs: 'none', sm: 'block' } }}>
            <Search sx={{ width: '100%' }}>
              <SearchIconWrapper>
                <span role="img" aria-label="Buscar">🔍</span>
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Buscar libros…"
                inputProps={{ 'aria-label': 'buscar libros' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ width: '100%' }}
              />
            </Search>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            <Button color="inherit" onClick={onBack}>Libros</Button>
            <Button color="inherit" onClick={onBack}>Novedades</Button>
            <Button color="inherit" onClick={onBack}>Locales</Button>
            <Button color="inherit" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>Contacto</Button>
            <IconButton color="inherit" onClick={() => setCartOpen(true)} sx={{ ml: 2, height: 48 }}>
              <Badge badgeContent={cart.length} color="secondary">
                <ShoppingCart sx={{ fontSize: 32 }} />
              </Badge>
            </IconButton>
            <Button color="inherit" sx={{ ml: 2, fontWeight: 500 }} onClick={onBack}>
              Volver
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral para mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {['Libros', 'Novedades', 'Locales', 'Contacto'].map((text) => (
              <ListItem 
                button 
                key={text} 
                onClick={() => {
                  if (text !== 'Contacto') {
                    onBack();
                  }
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box sx={{ 
        width: '100%', 
        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        py: 6,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="2"/%3E%3Ccircle cx="27" cy="7" r="2"/%3E%3Ccircle cx="47" cy="7" r="2"/%3E%3Ccircle cx="7" cy="27" r="2"/%3E%3Ccircle cx="27" cy="27" r="2"/%3E%3Ccircle cx="47" cy="27" r="2"/%3E%3Ccircle cx="7" cy="47" r="2"/%3E%3Ccircle cx="27" cy="47" r="2"/%3E%3Ccircle cx="47" cy="47" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }} />
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3, position: 'relative', textAlign: 'center' }}>
          <Typography variant="h2" sx={{ 
            color: 'white', 
            fontWeight: 800, 
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}>
            ¡Contáctanos!
          </Typography>
          <Typography variant="h5" sx={{ 
            color: 'rgba(255,255,255,0.9)', 
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            fontWeight: 300,
            lineHeight: 1.6
          }}>
            Estamos aquí para ayudarte con todas tus consultas sobre libros y nuestra librería
          </Typography>
        </Box>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: 3, py: 6, mt: -4, position: 'relative' }}>
        <Grid container spacing={4}>
          {/* Información de contacto */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
              {/* Header de información de contacto */}
              <Paper sx={{ 
                p: 4, 
                borderRadius: 4,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
              }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Box sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 8px 25px rgba(25,118,210,0.3)'
                  }}>
                    <Phone sx={{ color: 'white', fontSize: 32 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a202c', mb: 1 }}>
                    Contáctanos
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Estamos aquí para ayudarte
                  </Typography>
                </Box>
              </Paper>

              {/* Información de contacto principal */}
              <Paper sx={{ 
                p: 4, 
                borderRadius: 4,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                flex: 1
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a202c', mb: 3 }}>
                  📞 Canales de comunicación
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {/* Email */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: 'rgba(25, 118, 210, 0.05)',
                    border: '1px solid rgba(25, 118, 210, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      borderColor: 'rgba(25, 118, 210, 0.3)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(25,118,210,0.15)'
                    }
                  }}
                  onClick={() => window.open('mailto:olexiygrytsenko@gmail.com')}
                  >
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2.5,
                      flexShrink: 0
                    }}>
                      <Email sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a202c', mb: 0.5 }}>
                        Email principal
                      </Typography>
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                        olexiygrytsenko@gmail.com
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Respuesta en 24-48 horas
                      </Typography>
                    </Box>
                  </Box>

                  {/* Teléfono */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: 'rgba(76, 175, 80, 0.05)',
                    border: '1px solid rgba(76, 175, 80, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                      borderColor: 'rgba(76, 175, 80, 0.3)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(76,175,80,0.15)'
                    }
                  }}
                  onClick={() => window.open('tel:+541112345678')}
                  >
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: '#4caf50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2.5,
                      flexShrink: 0
                    }}>
                      <Phone sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a202c', mb: 0.5 }}>
                        Atención telefónica
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#4caf50' }}>
                        +54 11 1234-5678
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Lun-Vie 9:00-18:00, Sáb 10:00-16:00
                      </Typography>
                    </Box>
                  </Box>

                  {/* WhatsApp */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: 'rgba(37, 211, 102, 0.05)',
                    border: '1px solid rgba(37, 211, 102, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(37, 211, 102, 0.1)',
                      borderColor: 'rgba(37, 211, 102, 0.3)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(37,211,102,0.15)'
                    }
                  }}
                  onClick={() => window.open('https://wa.me/541112345678?text=Hola,%20me%20contacto%20desde%20la%20página%20web%20de%20la%20librería')}
                  >
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: '#25d366',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2.5,
                      flexShrink: 0
                    }}>
                      <Typography sx={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                        💬
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a202c', mb: 0.5 }}>
                        WhatsApp
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#25d366' }}>
                        +54 11 1234-5678
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Respuesta inmediata
                      </Typography>
                    </Box>
                  </Box>

                  {/* Ubicación */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: 'rgba(156, 39, 176, 0.05)',
                    border: '1px solid rgba(156, 39, 176, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(156, 39, 176, 0.1)',
                      borderColor: 'rgba(156, 39, 176, 0.3)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(156,39,176,0.15)'
                    }
                  }}
                  onClick={() => window.open('https://maps.google.com?q=Av.+Corrientes+1234,+Buenos+Aires,+Argentina')}
                  >
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: '#9c27b0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2.5,
                      flexShrink: 0
                    }}>
                      <LocationOn sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a202c', mb: 0.5 }}>
                        Nuestra librería
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#9c27b0', lineHeight: 1.4 }}>
                        Av. Corrientes 1234<br />
                        C1043 CABA, Argentina
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        📍 Clic para ver en Google Maps
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Horarios de atención */}
              <Paper sx={{ 
                p: 4, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5 }}>
                    🕒 Horarios de atención
                  </Typography>
                  <Box sx={{ textAlign: 'left', maxWidth: 280, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Lunes a Viernes:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        9:00 - 18:00
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Sábados:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        10:00 - 16:00
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Domingos:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                        Cerrado
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ 
                    opacity: 0.8, 
                    display: 'block',
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    pt: 2,
                    mt: 2
                  }}>
                    💡 También puedes enviarnos un mensaje las 24 horas
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>

          {/* Formulario de contacto */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ 
              p: 5, 
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.05)',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative element */}
              <Box sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                opacity: 0.05
              }} />
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 8px 25px rgba(76,175,80,0.3)'
                  }}>
                    <Send sx={{ color: 'white', fontSize: 40 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a202c', mb: 2 }}>
                    Envíanos un mensaje
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ 
                    maxWidth: 400, 
                    mx: 'auto',
                    lineHeight: 1.6,
                    fontSize: '1.1rem'
                  }}>
                    Completa el formulario y nos pondremos en contacto contigo lo antes posible
                  </Typography>
                </Box>
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Nombre completo"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'primary.main',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'primary.main',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Teléfono (opcional)"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        placeholder="+54 11 1234-5678"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'primary.main',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Asunto"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.subject}
                        helperText={errors.subject}
                        variant="outlined"
                        placeholder="¿En qué podemos ayudarte?"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'primary.main',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Mensaje"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        fullWidth
                        required
                        multiline
                        rows={10}
                        error={!!errors.message}
                        helperText={errors.message || 'Mínimo 10 caracteres'}
                        variant="outlined"
                        placeholder="Escribe tu mensaje aquí..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'primary.main',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        mt: 2,
                        mb: 2
                      }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          startIcon={<Send />}
                          sx={{ 
                            py: 2.5, 
                            px: 8,
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: 50,
                            background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                            boxShadow: '0 8px 32px rgba(76,175,80,0.4)',
                            border: 'none',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
                              boxShadow: '0 12px 40px rgba(76,175,80,0.6)',
                              transform: 'translateY(-3px)'
                            },
                            '&:active': {
                              transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.3s ease-in-out'
                          }}
                        >
                          Enviar mensaje
                        </Button>
                      </Box>
                      
                      <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => {
                            const subject = encodeURIComponent('Consulta desde la página web');
                            const body = encodeURIComponent('Hola,\n\nMe contacto desde la página web de la librería.\n\nSaludos.');
                            window.open(`mailto:olexiygrytsenko@gmail.com?subject=${subject}&body=${body}`);
                          }}
                          sx={{ 
                            textTransform: 'none',
                            fontSize: '0.9rem'
                          }}
                        >
                          📧 Enviar email directo
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        bgcolor: '#f8fafc', 
        py: 6,
        borderTop: '1px solid #e2e8f0'
      }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3 }}>
          <Typography variant="h4" sx={{ 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 2,
            color: '#1a202c'
          }}>
            ¿Por qué elegirnos?
          </Typography>
          <Typography variant="body1" sx={{ 
            textAlign: 'center', 
            color: 'text.secondary',
            mb: 5,
            maxWidth: 600,
            mx: 'auto',
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}>
            Somos más que una librería, somos tu compañero en el mundo de la lectura
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                textAlign: 'center',
                p: 4,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  '& .feature-icon': {
                    transform: 'scale(1.1)'
                  }
                }
              }}>
                <Box className="feature-icon" sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  transition: 'transform 0.3s ease'
                }}>
                  <Typography sx={{ fontSize: '2rem' }}>📚</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a202c' }}>
                  Amplio catálogo
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Miles de títulos en todas las categorías para satisfacer todos los gustos y edades
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                textAlign: 'center',
                p: 4,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  '& .feature-icon': {
                    transform: 'scale(1.1)'
                  }
                }
              }}>
                <Box className="feature-icon" sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  transition: 'transform 0.3s ease'
                }}>
                  <Typography sx={{ fontSize: '2rem' }}>🚚</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a202c' }}>
                  Envío rápido
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Entrega en 24-48 horas en CABA y GBA. Envíos a todo el país con seguimiento
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                textAlign: 'center',
                p: 4,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  '& .feature-icon': {
                    transform: 'scale(1.1)'
                  }
                }
              }}>
                <Box className="feature-icon" sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  transition: 'transform 0.3s ease'
                }}>
                  <Typography sx={{ fontSize: '2rem' }}>💬</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a202c' }}>
                  Atención personalizada
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Nuestro equipo te ayuda a encontrar el libro perfecto para cada ocasión
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContactForm;
