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
  Tooltip,
  Fab,
  TablePagination
} from '@mui/material';
import {
  Edit,
  Delete,
  ArrowBack,
  Add,
  Inventory,
  Image as ImageIcon,
  AttachMoney
} from '@mui/icons-material';

function ProductManagement({ onBack, user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  
  const [productForm, setProductForm] = useState({
    title: '',
    author: '',
    price: '',
    image: '',
    category: 'Artes'
  });

  // Categorías disponibles
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

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/products');
      if (!response.ok) {
        throw new Error('Error fetching products');
      }
      const productsData = await response.json();
      setProducts(productsData);
      setError('');
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar productos. Asegúrese de que el servidor esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update form when selected product changes
  useEffect(() => {
    if (selectedProduct && editDialogOpen) {
      const priceValue = selectedProduct.price ? selectedProduct.price.toString() : '';
      const editForm = {
        title: selectedProduct.title || '',
        author: selectedProduct.author || '',
        price: priceValue,
        image: selectedProduct.image || '',
        category: selectedProduct.category || 'Artes'
      };
      console.log('Updating form for selected product:', selectedProduct); // Debug log
      console.log('Price from DB:', selectedProduct.price); // Debug log
      console.log('Price as string:', priceValue); // Debug log
      console.log('Updated form data:', editForm); // Debug log
      setProductForm(editForm);
    }
  }, [selectedProduct, editDialogOpen]);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    const editForm = {
      title: product.title || '',
      author: product.author || '',
      price: product.price ? product.price.toString() : '',
      image: product.image || '',
      category: product.category || 'Artes'
    };
    console.log('Opening edit dialog with product:', product); // Debug log
    console.log('Opening edit dialog with form:', editForm); // Debug log
    setProductForm(editForm);
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    const initialForm = {
      title: '',
      author: '',
      price: '',
      image: '',
      category: 'Artes'
    };
    console.log('Opening add dialog with form:', initialForm); // Debug log
    setProductForm(initialForm);
    setAddDialogOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  // Funciones para paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calcular productos para la página actual
  const paginatedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    console.log('Form field changed:', name, '=', value); // Debug log
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSave = async () => {
    try {
      // Validaciones
      if (!productForm.title || !productForm.author || !productForm.price) {
        setSnackbarMessage('Título, autor y precio son campos obligatorios');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const price = parseFloat(productForm.price);
      if (isNaN(price) || price <= 0) {
        setSnackbarMessage('El precio debe ser un número válido mayor a 0');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productForm,
          price: price
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSnackbarMessage('Producto agregado exitosamente');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setAddDialogOpen(false);
        fetchProducts(); // Refresh the products list
      } else {
        setSnackbarMessage('Error al agregar producto: ' + (result.error || 'Error desconocido'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error de conexión al agregar producto');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEditSave = async () => {
    try {
      // Validaciones
      if (!productForm.title || !productForm.author || !productForm.price) {
        setSnackbarMessage('Título, autor y precio son campos obligatorios');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const price = parseFloat(productForm.price);
      if (isNaN(price) || price <= 0) {
        setSnackbarMessage('El precio debe ser un número válido mayor a 0');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const response = await fetch(`http://localhost:3001/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productForm,
          price: price
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSnackbarMessage('Producto actualizado exitosamente');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setEditDialogOpen(false);
        fetchProducts(); // Refresh the products list
      } else {
        setSnackbarMessage('Error al actualizar producto: ' + (result.error || 'Error desconocido'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error de conexión al actualizar producto');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${selectedProduct.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSnackbarMessage('Producto eliminado exitosamente');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setDeleteDialogOpen(false);
        fetchProducts(); // Refresh the products list
      } else {
        setSnackbarMessage('Error al eliminar producto: ' + (result.error || 'Error desconocido'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error de conexión al eliminar producto');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography variant="h6">Cargando productos...</Typography>
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
            <Inventory sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Administración de Productos
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content - Centrado como en la página de login */}
      <Box sx={{ mt: 4, width: '90%', maxWidth: '1400px', position: 'relative' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
              Lista de Productos ({products.length} total)
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddClick}
            >
              Agregar Producto
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Imagen</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Título</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Autor</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Precio</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.map((product, index) => (
                  <TableRow key={product.id} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.title}
                            style={{ 
                              width: 40, 
                              height: 50, 
                              objectFit: 'cover', 
                              borderRadius: 4 
                            }}
                          />
                        ) : (
                          <ImageIcon sx={{ fontSize: 40, color: '#666' }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{product.author}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoney sx={{ mr: 0.5, color: '#666', fontSize: 16 }} />
                        ARS ${Number(product.price).toLocaleString('es-AR', {minimumFractionDigits: 2})}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {product.category && (
                        <Chip 
                          label={product.category} 
                          size="small" 
                          variant="outlined" 
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Editar producto">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar producto">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
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
            count={products.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[20, 50, 100]}
            labelRowsPerPage="Productos por página:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
            sx={{
              borderTop: '1px solid #e0e0e0',
              mt: 1
            }}
          />
        </Paper>
      </Box>

      {/* Add Product Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Add sx={{ mr: 1 }} />
            Agregar Producto
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Título del libro"
                  name="title"
                  value={productForm.title}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Autor"
                  name="author"
                  value={productForm.author}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Precio (ARS)"
                  name="price"
                  value={productForm.price}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  placeholder="Ingrese el precio en ARS"
                  helperText="Ejemplo: 1500.50"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Categoría"
                  name="category"
                  value={productForm.category}
                  onChange={handleFormChange}
                  fullWidth
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="URL de imagen"
                  name="image"
                  value={productForm.image}
                  onChange={handleFormChange}
                  fullWidth
                  helperText="URL de la imagen del libro"
                />
                {/* Vista previa de imagen debajo */}
                {productForm.image && (
                  <Box sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    p: 2,
                    bgcolor: '#f9f9f9'
                  }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#666', textAlign: 'center' }}>
                      Vista previa de la imagen:
                    </Typography>
                    <Box
                      component="img"
                      src={productForm.image}
                      alt="Vista previa"
                      sx={{
                        maxWidth: '200px',
                        maxHeight: '250px',
                        objectFit: 'cover',
                        borderRadius: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onLoad={(e) => {
                        e.target.style.display = 'block';
                        e.target.nextSibling.style.display = 'none';
                      }}
                    />
                    <Box sx={{ 
                      display: 'none', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      color: '#999',
                      mt: 1
                    }}>
                      <ImageIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="caption">
                        No se pudo cargar la imagen
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAddDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleAddSave} variant="contained" color="primary">
            Agregar Producto
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        key={selectedProduct?.id || 'edit-dialog'}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Edit sx={{ mr: 1 }} />
            Editar Producto {selectedProduct?.id && `#${selectedProduct.id}`}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Título del libro"
                  name="title"
                  value={productForm.title}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Autor"
                  name="author"
                  value={productForm.author}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Precio (ARS)"
                  name="price"
                  value={productForm.price}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  placeholder="Ingrese el precio en ARS"
                  helperText="Ejemplo: 1500.50"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Categoría"
                  name="category"
                  value={productForm.category}
                  onChange={handleFormChange}
                  fullWidth
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="URL de imagen"
                  name="image"
                  value={productForm.image}
                  onChange={handleFormChange}
                  fullWidth
                  helperText="URL de la imagen del libro"
                />
                {/* Vista previa de imagen debajo */}
                {productForm.image && (
                  <Box sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    p: 2,
                    bgcolor: '#f9f9f9'
                  }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#666', textAlign: 'center' }}>
                      Vista previa de la imagen:
                    </Typography>
                    <Box
                      component="img"
                      src={productForm.image}
                      alt="Vista previa"
                      sx={{
                        maxWidth: '200px',
                        maxHeight: '250px',
                        objectFit: 'cover',
                        borderRadius: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onLoad={(e) => {
                        e.target.style.display = 'block';
                        e.target.nextSibling.style.display = 'none';
                      }}
                    />
                    <Box sx={{ 
                      display: 'none', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      color: '#999',
                      mt: 1
                    }}>
                      <ImageIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="caption">
                        No se pudo cargar la imagen
                      </Typography>
                    </Box>
                  </Box>
                )}
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
            ¿Estás seguro de que deseas eliminar el producto "{selectedProduct?.title}"? 
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

export default ProductManagement;
