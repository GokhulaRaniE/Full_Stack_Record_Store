import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Records from './pages/Records';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Admin from './pages/Admin';

function App() {
    // Load cart from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (record) => {
    // Check if user is logged in first
    if (!user) {
      alert('Please login first to add items to cart!');
      window.location.href = '/login';
      return;
    }

    const alreadyInCart = cart.find(item => item.id === record.id);
    if (alreadyInCart) {
      alert(record.title + ' is already in your cart!');
      return;
    }
    setCart([...cart, record]);
    alert(record.title + ' added to cart!');
  };

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  setCart([]);
  setUser(null);
  window.location.href = '/';
};

  return (
    <BrowserRouter>
      {/* Navbar */}
      <nav className="bg-blue-900 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="text-white text-xl font-bold tracking-wide">
          🎵 Record Store
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-white hover:text-blue-300 font-medium">
            Home
          </Link>
          <Link to="/records" className="text-white hover:text-blue-300 font-medium">
            Records
          </Link>

          {/* Show Cart and Orders only if logged in and NOT admin */}
            {user && user.role !== 'admin' && (
              <>
              <Link to="/cart" className="text-white hover:text-blue-300 font-medium">
              🛒 Cart ({cart.length})
              </Link>
              <Link to="/orders" className="text-white hover:text-blue-300 font-medium">
              Orders
              </Link>
              </>
              )}

          {/* Show Admin link only if user is admin */}
          {user && user.role === 'admin' && (
            <Link to="/admin" className="text-yellow-300 hover:text-yellow-400 font-medium">
              ⚙️ Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">👤 {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-white hover:text-blue-300 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/records" element={<Records addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;