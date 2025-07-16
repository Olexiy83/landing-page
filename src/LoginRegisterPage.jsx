import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Tabs, Tab, Paper, TextField, Grid, InputBase, IconButton, Drawer, List, ListItem, ListItemText, Divider, FormControlLabel, Checkbox, MenuItem, Badge } from '@mui/material';
import { ShoppingCart, Add, Remove } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { Menu as MenuIcon } from '@mui/icons-material';

// Estilos personalizados para el buscador (igual que en App.jsx)
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



function LoginRegisterPage({ 
  onBack, 
  onLogin, 
  cart = [], 
  cartOpen = false, 
  setCartOpen = () => {}, 
  removeFromCart = () => {},
  updateCartQuantity = () => {},
  increaseQuantity = () => {},
  decreaseQuantity = () => {},
  user = null
}) {
  const [tab, setTab] = useState(0);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', docType: 'DNI', docValue: '' });
  const [search, setSearch] = useState('');
  const [remember, setRemember] = useState(() => !!localStorage.getItem('rememberedEmail'));
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Al cargar, si hay email recordado, lo pone en el campo
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setLoginData((prev) => ({ ...prev, email: rememberedEmail }));
    }
  }, []);

  // Check if user is already logged in and redirect if so
  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData && userData.id && userData.name && userData.email) {
          // User is already logged in, redirect back
          onLogin(userData);
        }
      }
    } catch (error) {
      console.error('Error checking saved user:', error);
    }
  }, [onLogin]);

  const handleTabChange = (event, newValue) => setTab(newValue);
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  const handleDocTypeChange = (e) => setRegisterData({ ...registerData, docType: e.target.value });
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (remember) {
          localStorage.setItem('rememberedEmail', loginData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        onLogin(result.user);
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Asegúrese de que el servidor esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error || 'Error al registrarse');
      }
    } catch (err) {
      setError('Error de conexión. Asegúrese de que el servidor esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };
  const handleNav = () => onBack && onBack();
  const handleForgotPasswordClick = () => setShowForgotPassword(true);
  const handleForgotPasswordBack = () => setShowForgotPassword(false);

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#f5f6fa', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* AppBar superior igual a la principal */}
      <AppBar position="static" color="primary" elevation={2} sx={{ width: '100vw', borderRadius: 0 }}>
        <Toolbar sx={{ width: '100%', minHeight: 72, maxWidth: '100vw', mx: 'auto', px: 4 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={handleNav}
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
            <Button color="inherit" onClick={handleNav}>Libros</Button>
            <Button color="inherit" onClick={handleNav}>Novedades</Button>
            {/* <Button color="inherit" onClick={handleNav}>Ficción</Button> */}
            <Button color="inherit" onClick={handleNav}>Locales</Button>
            <Button color="inherit" onClick={handleNav}>Contacto</Button>
            <IconButton color="inherit" onClick={() => setCartOpen(true)} sx={{ ml: 2, height: 48 }}>
              <Badge badgeContent={cart.length} color="secondary">
                <ShoppingCart sx={{ fontSize: 32 }} />
              </Badge>
            </IconButton>
            {/* No mostrar el botón Acceder/Registrarme ni Volver aquí */}
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 8, width: 400, maxWidth: '90vw' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          {!showForgotPassword ? (
            <>
              <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 3 }}>
                <Tab label="Iniciar sesión" />
                <Tab label="Registrarme" />
              </Tabs>
              {tab === 0 && (
                <form onSubmit={handleLogin}>
                  {error && (
                    <Grid item>
                      <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {error}
                      </Typography>
                    </Grid>
                  )}
                  <Grid container spacing={2} direction="column">
                    <Grid item>
                      <TextField label="Correo electrónico" name="email" value={loginData.email} onChange={handleLoginChange} fullWidth required disabled={loading} />
                    </Grid>
                    <Grid item>
                      <TextField label="Contraseña" name="password" type="password" value={loginData.password} onChange={handleLoginChange} fullWidth required disabled={loading} />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        control={<Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} color="primary" disabled={loading} />}
                        label="Recordar"
                      />
                    </Grid>
                    <Grid item>
                      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Acceder'}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Box sx={{ textAlign: 'right' }}>
                        <Button color="primary" sx={{ textTransform: 'none', fontSize: 14 }} onClick={handleForgotPasswordClick} disabled={loading}>
                          ¿Has perdido tu contraseña?
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              )}
              {tab === 1 && (
                <form onSubmit={handleRegister}>
                  {error && (
                    <Grid item>
                      <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {error}
                      </Typography>
                    </Grid>
                  )}
                  <Grid container spacing={2} direction="column">
                    <Grid item>
                      <TextField label="Correo electrónico" name="email" value={registerData.email} onChange={handleRegisterChange} fullWidth required disabled={loading} />
                    </Grid>
                    <Grid item>
                      <TextField
                        select
                        label="Tipo de documento"
                        name="docType"
                        value={registerData.docType}
                        onChange={handleDocTypeChange}
                        fullWidth
                        required
                        disabled={loading}
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
                    <Grid item>
                      <TextField
                        label="Ingresá tu DNI, CUIT o pasaporte"
                        name="docValue"
                        value={registerData.docValue}
                        onChange={handleRegisterChange}
                        fullWidth
                        required
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item>
                      <TextField label="Nombre completo" name="name" value={registerData.name} onChange={handleRegisterChange} fullWidth required disabled={loading} />
                    </Grid>
                    <Grid item>
                      <TextField label="Contraseña" name="password" type="password" value={registerData.password} onChange={handleRegisterChange} fullWidth required disabled={loading} />
                    </Grid>
                    <Grid item>
                      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrarme'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )}
            </>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Recuperar contraseña</Typography>
              <Typography sx={{ mb: 2 }}>
                Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña.
              </Typography>
              <form onSubmit={e => { e.preventDefault(); alert('Instrucciones enviadas (simulado)'); setShowForgotPassword(false); }}>
                <TextField label="Correo electrónico" name="forgotEmail" type="email" fullWidth required sx={{ mb: 2 }} />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 1 }}>
                  Enviar instrucciones
                </Button>
                <Button variant="text" color="primary" fullWidth onClick={handleForgotPasswordBack}>
                  Volver
                </Button>
              </form>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Drawer para carrito (igual que en App.jsx) */}
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 320, p: 2, position: 'relative' }}>
          <IconButton
            aria-label="Cerrar"
            onClick={() => setCartOpen(false)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            ×
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, pr: 4 }}>
            Carrito de compras
            {cart.length > 0 && (
              <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                ({cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'artículo' : 'artículos'})
              </Typography>
            )}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {cart.length === 0 ? (
            <Typography color="text.secondary">El carrito está vacío.</Typography>
          ) : (
            <List>
              {cart.map((item) => (
                <ListItem 
                  key={item.id} 
                  sx={{ 
                    flexDirection: 'column', 
                    alignItems: 'stretch',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    mb: 1,
                    p: 2
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        ARS ${Number(item.price).toLocaleString('es-AR', {minimumFractionDigits:2})} c/u
                      </Typography>
                    </Box>
                    <Button 
                      color="error" 
                      size="small" 
                      onClick={() => removeFromCart(item.id)}
                      sx={{ minWidth: 'auto', p: 0.5 }}
                    >
                      ×
                    </Button>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                        Cantidad:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => decreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                          sx={{ 
                            borderRadius: 0,
                            '&:hover': { backgroundColor: '#f5f5f5' }
                          }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            updateCartQuantity(item.id, newQuantity);
                          }}
                          size="small"
                          sx={{ 
                            width: 50,
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                border: 'none'
                              }
                            },
                            '& .MuiInputBase-input': {
                              textAlign: 'center',
                              padding: '6px 4px',
                              fontSize: '0.9rem'
                            }
                          }}
                          inputProps={{ 
                            min: 1,
                            max: 99,
                            type: 'number'
                          }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => increaseQuantity(item.id)}
                          sx={{ 
                            borderRadius: 0,
                            '&:hover': { backgroundColor: '#f5f5f5' }
                          }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        ARS ${Number(item.price * item.quantity).toLocaleString('es-AR', {minimumFractionDigits:2})}
                      </Typography>
                      {item.quantity > 1 && (
                        <Typography variant="caption" color="text.secondary">
                          ({item.quantity} × ARS ${Number(item.price).toLocaleString('es-AR', {minimumFractionDigits:2})})
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography align="right" fontWeight={700} variant="h6" color="primary.main">
              Total: ARS ${Number(cart.reduce((sum, item) => sum + item.price * item.quantity, 0)).toLocaleString('es-AR', {minimumFractionDigits:2})}
            </Typography>
            {cart.length > 0 && (
              <Typography align="right" variant="body2" color="text.secondary">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'artículo' : 'artículos'} en total
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
            disabled={cart.length === 0 || !user}
            onClick={() => alert('¡Gracias por su compra!')}
          >
            {!user ? 'Inicia sesión para comprar' : 'Comprar'}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}

export default LoginRegisterPage;
