import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Shop from './pages/Shop';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogAdmin from './pages/BlogAdmin';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseDetail from './pages/CourseDetail';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PurchaseComplete from './pages/PurchaseComplete';
import OrderTracking from './pages/OrderTracking';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => 
        cartItem.id === item.id && cartItem.type === item.type
      );
      
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id && cartItem.type === item.type
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId, type) => {
    setCart(prev => prev.filter(item => !(item.id === itemId && item.type === type)));
  };

  const updateCartQuantity = (itemId, type, quantity) => {
    if (quantity === 0) {
      removeFromCart(itemId, type);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.id === itemId && item.type === type
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} cartCount={cart.length} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses addToCart={addToCart} />} />
          <Route path="/courses/:id" element={<CourseDetail addToCart={addToCart} />} />
          <Route path="/shop" element={<Shop addToCart={addToCart} />} />
          <Route path="/shop/:id" element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog-admin" element={<BlogAdmin />} />
          <Route path="/cart" element={
            <Cart 
              cart={cart} 
              updateCartQuantity={updateCartQuantity} 
              removeFromCart={removeFromCart} 
            />
          } />
          <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
          <Route path="/purchase-complete" element={<PurchaseComplete />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;