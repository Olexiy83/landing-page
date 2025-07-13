


import { useState } from 'react';
import { products } from './products';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

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

  const filteredProducts = products.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cus-root">
      {/* Top navigation bar */}
      <header className="cus-header">
        <div className="cus-header-main">
          <div className="cus-logo">Librería</div>
          <input
            className="cus-search"
            type="text"
            placeholder="Ingresar título, autor, ISBN, palabra clave o categoría"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <nav className="cus-nav">
            <a href="#">Libros</a>
            <a href="#">Catálogo</a>
            <a href="#">Novedades</a>
            <a href="#">Ficción</a>
            <a href="#">Locales</a>
            <a href="#">Contacto</a>
          </nav>
          <div className="cus-user-actions">
            <span className="cus-wishlist">&#9829;</span>
            <span className="cus-cart">
              <span role="img" aria-label="cart">🛒</span>
              <span className="cus-cart-count">{cart.length}</span>
            </span>
          </div>
        </div>
      </header>

      <div className="cus-main">
        {/* Sidebar filters */}
        <aside className="cus-sidebar">
          <div className="cus-category-list">
            <div className="cus-category">Artes</div>
            <div className="cus-category">Bibliotecología y museología</div>
            <div className="cus-category">Ciencias de la Tierra</div>
            <div className="cus-category">Ciencias y matemáticas</div>
            <div className="cus-category">Computación y tecnología de la información</div>
            <div className="cus-category">Deportes y actividades al aire libre</div>
            <div className="cus-category">Derecho</div>
            <div className="cus-category">Economía, finanzas, empresa y gestión</div>
            <div className="cus-category">Ficción</div>
            <div className="cus-category">Filosofía y religión</div>
            <div className="cus-category">Historia y arqueología</div>
            <div className="cus-category">Infantil y Juvenil</div>
            <div className="cus-category">Lenguaje y lingüística</div>
            <div className="cus-category">Literatura, estudios literarios y biografías</div>
            <div className="cus-category">Medicina y salud</div>
            <div className="cus-category">Narrativas ilustradas</div>
          </div>
        </aside>

        {/* Product grid */}
        <main className="cus-catalog">
          <div className="cus-results-bar">
            Mostrando 1–{filteredProducts.length} de {products.length} resultados
            <select className="cus-sort">
              <option>Ordenar por popularidad</option>
            </select>
          </div>
          <div className="cus-product-grid">
            {filteredProducts.map((book) => (
              <div className="cus-product-card" key={book.id}>
                <img src={book.image} alt={book.title} className="cus-product-img" />
                <div className="cus-product-info">
                  <div className="cus-title">{book.title}</div>
                  <div className="cus-author">{book.author}</div>
                  <div className="cus-price">ARS ${book.price.toLocaleString('es-AR', {minimumFractionDigits:2})}</div>
                  <button className="cus-btn" onClick={() => addToCart(book)}>Agregar al carrito</button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Cart sidebar */}
        <aside className="cus-cart-sidebar" style={{width: '300px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1.5rem 1rem', height: 'fit-content', marginLeft: '2rem'}}>
          <h3>Carrito de compras</h3>
          {cart.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <ul style={{listStyle: 'none', padding: 0}}>
              {cart.map((item) => (
                <li key={item.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem'}}>
                  <span>{item.title} x {item.quantity}</span>
                  <span>ARS ${Number(item.price * item.quantity).toLocaleString('es-AR', {minimumFractionDigits:2})}</span>
                  <button className="cus-btn" style={{background: '#d35400', padding: '0.2rem 0.7rem', fontSize: '0.9rem'}} onClick={() => removeFromCart(item.id)}>Quitar</button>
                </li>
              ))}
            </ul>
          )}
          <div style={{marginTop: '1rem', fontWeight: 'bold', fontSize: '1.1em', textAlign: 'right'}}>
            Total: ARS ${Number(cart.reduce((sum, item) => sum + item.price * item.quantity, 0)).toLocaleString('es-AR', {minimumFractionDigits:2})}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
