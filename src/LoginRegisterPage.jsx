import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Tabs, Tab, Paper, TextField, Grid, InputBase, IconButton, Drawer, List, ListItem, ListItemText, Divider, FormControlLabel, Checkbox, MenuItem } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
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



function LoginRegisterPage({ onBack, cart = [], cartOpen = false, setCartOpen = () => {}, removeFromCart = () => {} }) {
  const [tab, setTab] = useState(0);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', docType: 'DNI', docValue: '' });
  const [search, setSearch] = useState('');
  const [remember, setRemember] = useState(() => !!localStorage.getItem('rememberedEmail'));
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Al cargar, si hay email recordado, lo pone en el campo
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setLoginData((prev) => ({ ...prev, email: rememberedEmail }));
    }
  }, []);

  const handleTabChange = (event, newValue) => setTab(newValue);
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  const handleDocTypeChange = (e) => setRegisterData({ ...registerData, docType: e.target.value });
  const handleLogin = (e) => {
    e.preventDefault();
    if (remember) {
      localStorage.setItem('rememberedEmail', loginData.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    alert('Inicio de sesión simulado');
  };
  const handleRegister = (e) => {
    e.preventDefault();
    alert('Registro simulado');
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
            <Button color="inherit" onClick={handleNav}>Catálogo</Button>
            <Button color="inherit" onClick={handleNav}>Novedades</Button>
            {/* <Button color="inherit" onClick={handleNav}>Ficción</Button> */}
            <Button color="inherit" onClick={handleNav}>Locales</Button>
            <Button color="inherit" onClick={handleNav}>Contacto</Button>
            <IconButton color="inherit" onClick={() => setCartOpen(true)} sx={{ ml: 2, height: 48 }}>
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <ShoppingCart sx={{ fontSize: 32 }} />
                {cart.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: '#f50057',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>{cart.length}</span>
                )}
              </span>
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
                  <Grid container spacing={2} direction="column">
                    <Grid item>
                      <TextField label="Correo electrónico" name="email" value={loginData.email} onChange={handleLoginChange} fullWidth required />
                    </Grid>
                    <Grid item>
                      <TextField label="Contraseña" name="password" type="password" value={loginData.password} onChange={handleLoginChange} fullWidth required />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        control={<Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} color="primary" />}
                        label="Recordar"
                      />
                    </Grid>
                    <Grid item>
                      <Button type="submit" variant="contained" color="primary" fullWidth>Acceder</Button>
                    </Grid>
                    <Grid item>
                      <Box sx={{ textAlign: 'right' }}>
                        <Button color="primary" sx={{ textTransform: 'none', fontSize: 14 }} onClick={handleForgotPasswordClick}>
                          ¿Has perdido tu contraseña?
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              )}
              {tab === 1 && (
                <form onSubmit={handleRegister}>
                  <Grid container spacing={2} direction="column">
                    <Grid item>
                      <TextField label="Correo electrónico" name="email" value={registerData.email} onChange={handleRegisterChange} fullWidth required />
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
                      />
                    </Grid>
                    <Grid item>
                      <TextField label="Nombre completo" name="name" value={registerData.name} onChange={handleRegisterChange} fullWidth required />
                    </Grid>
                    <Grid item>
                      <TextField label="Contraseña" name="password" type="password" value={registerData.password} onChange={handleRegisterChange} fullWidth required />
                    </Grid>
                    <Grid item>
                      <Button type="submit" variant="contained" color="primary" fullWidth>Registrarme</Button>
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
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, pr: 4 }}>Carrito de compras</Typography>
          <Divider sx={{ mb: 2 }} />
          {cart.length === 0 ? (
            <Typography color="text.secondary">El carrito está vacío.</Typography>
          ) : (
            <List>
              {cart.map((item) => (
                <ListItem key={item.id} secondaryAction={
                  <Button color="error" size="small" onClick={() => removeFromCart(item.id)}>
                    Quitar
                  </Button>
                }>
                  <ListItemText
                    primary={`${item.title} x ${item.quantity}`}
                    secondary={`ARS $${Number(item.price * item.quantity).toLocaleString('es-AR', {minimumFractionDigits:2})}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography align="right" fontWeight={700}>
            Total: ARS ${Number(cart.reduce((sum, item) => sum + item.price * item.quantity, 0)).toLocaleString('es-AR', {minimumFractionDigits:2})}
          </Typography>
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
            disabled={cart.length === 0}
            onClick={() => alert('¡Gracias por su compra!')}
          >
            Comprar
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}

export default LoginRegisterPage;
