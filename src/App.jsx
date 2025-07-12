
import { useState } from 'react';
import { products } from './products';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);

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

  const featured = products.filter((p) => p.featured);
  const others = products.filter((p) => !p.featured);

  return (
    <div className="bookstore-container">
      <header>
        <h1>Bienvenido a la Tienda de Libros</h1>
        <p>Descubre nuestros libros destacados y agrega tus favoritos al carrito.</p>
      </header>

      <section className="banners">
        {featured.map((book) => (
          <div className="banner" key={book.id}>
            <img src={book.image} alt={book.title} className="banner-img" />
            <div className="banner-info">
              <h2>{book.title}</h2>
              <p>por {book.author}</p>
              <p className="price">${book.price.toFixed(2)}</p>
              <button onClick={() => addToCart(book)}>Comprar</button>
            </div>
          </div>
        ))}
      </section>

      <section className="products">
        <h2>Catálogo</h2>
        <div className="product-list">
          {others.map((book) => (
            <div className="product-card" key={book.id}>
              <img src={book.image} alt={book.title} className="product-img" />
              <h3>{book.title}</h3>
              <p>por {book.author}</p>
              <p className="price">${book.price.toFixed(2)}</p>
              <button onClick={() => addToCart(book)}>Agregar al carrito</button>
            </div>
          ))}
        </div>
      </section>

      <aside className="cart">
        <h2>Carrito de Compras</h2>
        {cart.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                <span>{item.title} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)}>Quitar</button>
              </li>
            ))}
          </ul>
        )}
        <div className="cart-total">
          Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
        </div>
      </aside>
    </div>
  );
}

export default App;
