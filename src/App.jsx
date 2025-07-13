



import { useState } from 'react';
import { products } from './products';
import {
  AppBar, Toolbar, Typography, InputBase, IconButton, Badge, Drawer, List, ListItem, ListItemText, Box, Button, Grid, Card, CardMedia, CardContent, CardActions, Select, MenuItem, Divider, Paper
} from '@mui/material';
import { ShoppingCart, Favorite, Menu as MenuIcon } from '@mui/icons-material';
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
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

function App() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('popularidad');

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

  let filteredProducts = products.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase())
  );

  // Ordenar según la opción seleccionada
  if (sortOption === 'nombre') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === 'autor') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.author.localeCompare(b.author));
  } else if (sortOption === 'precio') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  }

  // Categorías para el sidebar
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
    'Narrativas ilustradas',
  ];

  // Drawer para carrito
  const [cartOpen, setCartOpen] = useState(false);
  // Drawer para menú lateral en mobile
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f6fa', minHeight: '100vh' }}>
      {/* AppBar superior */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Librería
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            <Button color="inherit">Libros</Button>
            <Button color="inherit">Catálogo</Button>
            <Button color="inherit">Novedades</Button>
            <Button color="inherit">Ficción</Button>
            <Button color="inherit">Locales</Button>
            <Button color="inherit">Contacto</Button>
          </Box>
          <Search>
            <SearchIconWrapper>
              <MenuIcon sx={{ opacity: 0 }} /> {/* Espacio para el icono, invisible */}
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar libro, autor, ISBN, palabra clave..."
              inputProps={{ 'aria-label': 'search' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </Search>
          <IconButton color="inherit" sx={{ ml: 2 }}>
            <Favorite />
          </IconButton>
          <IconButton color="inherit" onClick={() => setCartOpen(true)}>
            <Badge badgeContent={cart.length} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral para mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {['Libros', 'Catálogo', 'Novedades', 'Ficción', 'Locales', 'Contacto'].map((text) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Layout principal */}
      <Grid container spacing={2} sx={{ p: 3 }}>
        {/* Sidebar de categorías y catálogo juntos */}
        <Grid item xs={12} sm={12} md={12}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Categorías</Typography>
            <List sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categories.map((cat) => (
                <ListItem button key={cat} sx={{ width: 'auto', borderRadius: 2, px: 2 }}>
                  <ListItemText primary={cat} />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1">
              Mostrando 1–{filteredProducts.length} de {products.length} resultados
            </Typography>
            <Select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              size="small"
              sx={{ minWidth: 180, bgcolor: 'white', borderRadius: 2 }}
            >
              <MenuItem value="popularidad">Ordenar por popularidad</MenuItem>
              <MenuItem value="nombre">Ordenar por nombre</MenuItem>
              <MenuItem value="autor">Ordenar por autor</MenuItem>
              <MenuItem value="precio">Ordenar por el precio</MenuItem>
            </Select>
          </Box>
          <Grid container spacing={2}>
            {filteredProducts.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={book.image}
                    alt={book.title}
                    sx={{ objectFit: 'contain', p: 1, bgcolor: '#f8f8f8' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>{book.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{book.author}</Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 700 }}>
                      ARS ${book.price.toLocaleString('es-AR', {minimumFractionDigits:2})}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="contained" color="primary" fullWidth onClick={() => addToCart(book)}>
                      Agregar al carrito
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>


      {/* Drawer para carrito (mobile) */}
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 320, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Carrito de compras</Typography>
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
        </Box>
      </Drawer>
    </Box>
  );
}

export default App;
