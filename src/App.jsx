



import { useState, useEffect } from 'react';
import LoginRegisterPage from './LoginRegisterPage';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import ContactForm from './ContactForm';
import MessagesManagement from './MessagesManagement';
import {
  AppBar, Toolbar, Typography, InputBase, IconButton, Badge, Drawer, List, ListItem, ListItemText, Box, Button, Grid, Card, CardMedia, CardContent, CardActions, Select, MenuItem, Divider, Paper, TextField, Snackbar, Alert, Menu, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
} from '@mui/material';
import { ShoppingCart, Menu as MenuIcon, ExitToApp, Add, Remove, Person, KeyboardArrowDown, Inventory, Email } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

// Estilos personalizados para el buscador
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
    // Eliminar el cambio de ancho en 'md' para que no se achique
  },
}));

function App() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('popularidad');
  const [showLogin, setShowLogin] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showProductManagement, setShowProductManagement] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showMessagesManagement, setShowMessagesManagement] = useState(false);
  const [user, setUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booksMenuAnchor, setBooksMenuAnchor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    docType: '',
    docValue: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Categorías disponibles para el menú de libros
  const categories = [
    'Artes',
    'Bibliotecología y museología',
    'Ciencias de la Tierra',
    'Ciencias y matemáticas',
    'Computación y tecnología de la información',
    'Deportes y actividades al aire libre',
    'Derecho',
    'Economía, finanzas, empresa y gestión',
    'Ficción',
    'Filosofía y religión',
    'Historia y arqueología',
    'Infantil y Juvenil',
    'Lenguaje y lingüística',
    'Literatura, estudios literarios y biografías',
    'Medicina y salud',
    'Narrativas ilustradas'
  ];

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Handlers for books dropdown menu
  const handleBooksMenuOpen = (event) => {
    setBooksMenuAnchor(event.currentTarget);
  };

  const handleBooksMenuClose = () => {
    setBooksMenuAnchor(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleBooksMenuClose();
    // Filter products by category
    // You can add filtering logic here if needed
  };

  // Check for saved user data on component mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      console.log('Checking for saved user data:', savedUser);
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        // Validate that the saved data has the required fields
        if (userData && userData.id && userData.name && userData.email) {
          console.log('Valid user data found, logging in user:', userData.name);
          setUser(userData);
          // Initialize profile data with saved user data
          setProfileData({
            name: userData.name || '',
            email: userData.email || '',
            docType: userData.docType || '',
            docValue: userData.docValue || ''
          });
        } else {
          // Clean up invalid data
          console.log('Invalid user data found, cleaning up');
          localStorage.removeItem('currentUser');
        }
      } else {
        console.log('No saved user data found');
      }
    } catch (error) {
      console.error('Error loading saved user data:', error);
      localStorage.removeItem('currentUser');
    }
  }, []);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/products');
        if (!response.ok) {
          throw new Error('Error fetching products');
        }
        const productsData = await response.json();
        console.log('Products fetched from database:', productsData);
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error loading products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogin = (userData) => {
    try {
      console.log('Logging in user:', userData);
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setShowLogin(false);
      // Initialize profile data with user data
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        docType: userData.docType || '',
        docValue: userData.docValue || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleLogout = () => {
    try {
      console.log('Logging out user:', user?.name);
      setUser(null);
      localStorage.removeItem('currentUser');
      setCart([]); // Clear cart on logout
      setUserMenuAnchor(null);
      setProfileData({ name: '', email: '', docType: '', docValue: '', currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleProfileClick = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        docType: user.docType || '',
        docValue: user.docValue || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    setProfileDialogOpen(true);
    handleUserMenuClose();
  };

  const handleProfileClose = () => {
    setProfileDialogOpen(false);
    setShowPasswordFields(false);
    // Limpiar campos de contraseña al cerrar
    setProfileData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleProfileDataChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSave = async () => {
    try {
      // Validaciones de contraseña si se está intentando cambiar
      if (profileData.newPassword || profileData.confirmPassword || profileData.currentPassword) {
        if (!profileData.currentPassword) {
          setSnackbarMessage('Debe ingresar su contraseña actual para cambiarla');
          setSnackbarOpen(true);
          return;
        }
        if (!profileData.newPassword) {
          setSnackbarMessage('Debe ingresar una nueva contraseña');
          setSnackbarOpen(true);
          return;
        }
        if (profileData.newPassword !== profileData.confirmPassword) {
          setSnackbarMessage('Las contraseñas nuevas no coinciden');
          setSnackbarOpen(true);
          return;
        }
        if (profileData.newPassword.length < 6) {
          setSnackbarMessage('La nueva contraseña debe tener al menos 6 caracteres');
          setSnackbarOpen(true);
          return;
        }
      }

      const response = await fetch('http://localhost:3001/api/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: profileData.name,
          email: profileData.email,
          docType: profileData.docType,
          docValue: profileData.docValue,
          ...(profileData.newPassword && {
            currentPassword: profileData.currentPassword,
            newPassword: profileData.newPassword
          })
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        const updatedUser = { ...user, name: profileData.name, email: profileData.email, docType: profileData.docType, docValue: profileData.docValue };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setSnackbarMessage(profileData.newPassword ? 'Perfil y contraseña actualizados exitosamente' : 'Perfil actualizado exitosamente');
        setSnackbarOpen(true);
        setProfileDialogOpen(false);
        // Limpiar campos de contraseña
        setProfileData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setSnackbarMessage('Error al actualizar el perfil: ' + (result.error || 'Error desconocido'));
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error de conexión al actualizar el perfil');
      setSnackbarOpen(true);
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    if (newQuantity > 99) {
      // Limit maximum quantity to 99
      newQuantity = 99;
    }
    setCart((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const increaseQuantity = (id) => {
    setCart((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    setSnackbarMessage('Cantidad actualizada');
    setSnackbarOpen(true);
  };

  const decreaseQuantity = (id) => {
    setCart((prev) => 
      prev.map((item) => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity - 1) } 
          : item
      )
    );
    setSnackbarMessage('Cantidad actualizada');
    setSnackbarOpen(true);
  };

  let filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === '' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Ordenar según la opción seleccionada
  if (sortOption === 'nombre') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === 'autor') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.author.localeCompare(b.author));
  } else if (sortOption === 'precio') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  }

  if (showLogin) {
    return (
      <LoginRegisterPage
        onBack={() => setShowLogin(false)}
        onLogin={handleLogin}
        cart={cart}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        removeFromCart={removeFromCart}
        updateCartQuantity={updateCartQuantity}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        user={user}
      />
    );
  }

  if (showUserManagement) {
    return (
      <UserManagement
        onBack={() => setShowUserManagement(false)}
        user={user}
      />
    );
  }

  if (showProductManagement) {
    return (
      <ProductManagement
        onBack={() => setShowProductManagement(false)}
        user={user}
      />
    );
  }

  if (showContactForm) {
    return (
      <ContactForm
        onBack={() => setShowContactForm(false)}
        cart={cart}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
      />
    );
  }

  if (showMessagesManagement) {
    return (
      <MessagesManagement
        onBack={() => setShowMessagesManagement(false)}
        user={user}
      />
    );
  }

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#f5f6fa', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* AppBar superior */}
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
            <Button 
              color="inherit" 
              onClick={handleBooksMenuOpen}
              endIcon={<KeyboardArrowDown />}
            >
              Libros
            </Button>
            <Button color="inherit">Novedades</Button>
            {/* <Button color="inherit">Ficción</Button> */}
            <Button color="inherit">Locales</Button>
            <Button color="inherit" onClick={() => setShowContactForm(true)}>Contacto</Button>
            <IconButton color="inherit" onClick={() => setCartOpen(true)} sx={{ ml: 2, height: 48 }}>
              <Badge badgeContent={cart.length} color="secondary">
                <ShoppingCart sx={{ fontSize: 32 }} />
              </Badge>
            </IconButton>
            {user ? (
              <Box sx={{ 
                ml: 2, 
                display: 'flex', 
                alignItems: 'center'
              }}>
                <Button
                  color="inherit"
                  onClick={handleUserMenuClick}
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: 3, 
                    px: 2, 
                    py: 0.5,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                  endIcon={<KeyboardArrowDown />}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        backgroundColor: '#4caf50', 
                        borderRadius: '50%', 
                        mr: 1 
                      }} 
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'white'
                      }}
                    >
                      {user.name}
                    </Typography>
                  </Box>
                </Button>
                
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 180
                    }
                  }}
                >
                  <MenuItem onClick={handleProfileClick}>
                    <Person sx={{ mr: 1 }} />
                    Perfil de usuario
                  </MenuItem>
                  {user?.email === 'admin' && (
                    <>
                      <Divider />
                      <MenuItem onClick={() => {
                        handleUserMenuClose();
                        setShowUserManagement(true);
                      }}>
                        <Person sx={{ mr: 1 }} />
                        Administrar usuarios
                      </MenuItem>
                      <MenuItem onClick={() => {
                        handleUserMenuClose();
                        setShowProductManagement(true);
                      }}>
                        <Inventory sx={{ mr: 1 }} />
                        Administrar productos
                      </MenuItem>
                      <MenuItem onClick={() => {
                        handleUserMenuClose();
                        setShowMessagesManagement(true);
                      }}>
                        <Email sx={{ mr: 1 }} />
                        Mensajes enviados
                      </MenuItem>
                    </>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ExitToApp sx={{ mr: 1 }} />
                    Cerrar sesión
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button color="inherit" sx={{ ml: 2, fontWeight: 500 }} onClick={() => setShowLogin(true)}>
                Acceder / Registrarme
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu desplegable para Libros */}
      <Menu
        anchorEl={booksMenuAnchor}
        open={Boolean(booksMenuAnchor)}
        onClose={handleBooksMenuClose}
        MenuListProps={{
          'aria-labelledby': 'books-button',
        }}
        PaperProps={{
          sx: {
            maxHeight: 400,
            minWidth: 280,
          }
        }}
      >
        <MenuItem onClick={() => handleCategorySelect('')} sx={{ fontWeight: selectedCategory === '' ? 600 : 400 }}>
          Todas las categorías
        </MenuItem>
        <Divider />
        {categories.map((category) => (
          <MenuItem 
            key={category} 
            onClick={() => handleCategorySelect(category)}
            sx={{ fontWeight: selectedCategory === category ? 600 : 400 }}
          >
            {category}
          </MenuItem>
        ))}
      </Menu>

      {/* Drawer lateral para mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {['Libros', 'Novedades', 'Locales', 'Contacto'].map((text) => (
              <ListItem 
                button 
                key={text} 
                onClick={() => {
                  if (text === 'Contacto') {
                    setShowContactForm(true);
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

      {/* Layout principal */}
      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
        <Paper elevation={0} sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3, 
          bgcolor: 'white',
          maxWidth: 800,
          mx: 'auto'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Catálogo de Libros
              </Typography>
              {filteredProducts.length > 0 && (
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  backgroundColor: '#f5f5f5',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontWeight: 500
                }}>
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'libro' : 'libros'}
                </Typography>
              )}
            </Box>
            <Select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              size="small"
              sx={{ 
                minWidth: 250,
                maxWidth: 300,
                bgcolor: 'white', 
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3483fa',
                  },
                }
              }}
            >
              <MenuItem value="popularidad">📈 Ordenar por popularidad</MenuItem>
              <MenuItem value="nombre">🔤 Ordenar por nombre</MenuItem>
              <MenuItem value="autor">👤 Ordenar por autor</MenuItem>
              <MenuItem value="precio">💰 Ordenar por precio</MenuItem>
            </Select>
          </Box>
          
          {/* Filtro activo */}
          {selectedCategory && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              backgroundColor: '#e3f2fd',
              padding: '12px 20px',
              borderRadius: 3,
              border: '1px solid #bbdefb',
              mb: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  📚 Filtro activo:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {selectedCategory}
                </Typography>
              </Box>
              <Button 
                size="small" 
                variant="contained" 
                color="secondary"
                onClick={() => handleCategorySelect('')}
                sx={{ 
                  minWidth: 'auto',
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 1.5,
                  textTransform: 'none',
                  borderRadius: 2
                }}
              >
                ✕ Limpiar filtro
              </Button>
            </Box>
          )}
        </Paper>

        {/* Grid de productos mejorado */}
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          alignItems: 'stretch'
        }}>
          {loading ? (
            <Box sx={{ 
              width: '100%',
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: 400,
              flexDirection: 'column'
            }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                Cargando productos...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ 
              width: '100%',
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: 400,
              flexDirection: 'column',
              textAlign: 'center'
            }}>
              <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                ⚠️ {error}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => window.location.reload()}
                sx={{ borderRadius: 2 }}
              >
                🔄 Reintentar
              </Button>
            </Box>
          ) : filteredProducts.length === 0 ? (
            <Box sx={{ 
              width: '100%',
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: 400,
              flexDirection: 'column',
              textAlign: 'center'
            }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                📖 No se encontraron productos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intenta ajustar tu búsqueda o filtros
              </Typography>
            </Box>
          ) : (
            filteredProducts.map((book) => (
              <Card 
                key={book.id} 
                sx={{ 
                  width: {
                    xs: 'calc(100% - 16px)',
                    sm: 'calc(50% - 12px)',
                    md: 'calc(33.333% - 16px)',
                    lg: 'calc(25% - 18px)',
                    xl: 'calc(20% - 19.2px)'
                  },
                  maxWidth: 280,
                  minWidth: 240,
                  height: 380,
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  bgcolor: 'white',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 8px 32px rgba(52,131,250,0.15)',
                  }
                }}
              >
                <Box sx={{ 
                  height: 160, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: '#fafafa',
                  p: 1.5
                }}>
                  <CardMedia
                    component="img"
                    image={book.image}
                    alt={book.title}
                    sx={{ 
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: 1
                    }}
                  />
                </Box>
                <CardContent sx={{ 
                  flex: 1,
                  p: 1.5,
                  pb: 0,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      fontSize: '0.95rem',
                      lineHeight: 1.2,
                      mb: 0.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: '2.4em'
                    }}
                  >
                    {book.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 1,
                      fontSize: '0.85rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    👤 {book.author}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'primary.main',
                      mb: 1.5,
                      fontSize: '1.1rem',
                      textAlign: 'center'
                    }}
                  >
                    💰 ARS ${book.price.toLocaleString('es-AR', {minimumFractionDigits:2})}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 1.5, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => addToCart(book)}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 0.8,
                      fontSize: '0.9rem',
                      bgcolor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        transform: 'scale(1.02)'
                      }
                    }}
                  >
                    🛒 Agregar al carrito
                  </Button>
                </Box>
              </Card>
            ))
          )}
        </Box>
      </Box>


      {/* Drawer para carrito (mobile) */}
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

      {/* Dialog para editar perfil de usuario */}
      <Dialog open={profileDialogOpen} onClose={handleProfileClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 1 }} />
            Perfil de Usuario
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre completo"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileDataChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Correo electrónico"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileDataChange}
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
                  value={profileData.docType}
                  onChange={handleProfileDataChange}
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
                  value={profileData.docValue}
                  onChange={handleProfileDataChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                  <Button
                    variant={showPasswordFields ? "contained" : "outlined"}
                    color="secondary"
                    onClick={() => {
                      setShowPasswordFields(!showPasswordFields);
                      if (showPasswordFields) {
                        // Limpiar campos de contraseña al ocultar
                        setProfileData(prev => ({
                          ...prev,
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        }));
                      }
                    }}
                  >
                    {showPasswordFields ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
                  </Button>
                </Box>
              </Grid>
              {showPasswordFields && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Contraseña actual"
                      name="currentPassword"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={handleProfileDataChange}
                      fullWidth
                      required
                      helperText="Ingrese su contraseña actual para confirmar el cambio"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Nueva contraseña"
                      name="newPassword"
                      type="password"
                      value={profileData.newPassword}
                      onChange={handleProfileDataChange}
                      fullWidth
                      required
                      helperText="Mínimo 6 caracteres"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Confirmar nueva contraseña"
                      name="confirmPassword"
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={handleProfileDataChange}
                      fullWidth
                      required
                      error={profileData.confirmPassword && profileData.newPassword !== profileData.confirmPassword}
                      helperText={
                        profileData.confirmPassword && profileData.newPassword !== profileData.confirmPassword
                          ? "Las contraseñas no coinciden"
                          : "Repita la nueva contraseña"
                      }
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleProfileClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleProfileSave} variant="contained" color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
