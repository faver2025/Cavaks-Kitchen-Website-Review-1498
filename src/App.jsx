import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import BlogAdmin from './pages/BlogAdmin';
import PurchaseComplete from './pages/PurchaseComplete';
import OrderTracking from './pages/OrderTracking';

const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (savedUser) {
      setUser(savedUser);
    }

    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever cart changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => 
        cartItem.id === item.id && cartItem.type === item.type
      );
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id && cartItem.type === item.type
            ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  const updateCartQuantity = (itemId, itemType, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, itemType);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId && item.type === itemType
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (itemId, itemType) => {
    setCart(prevCart =>
      prevCart.filter(item => 
        !(item.id === itemId && item.type === itemType)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} cartCount={cartCount} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses addToCart={addToCart} />} />
            <Route path="/courses/:id" element={<CourseDetail addToCart={addToCart} />} />
            <Route path="/shop" element={<Shop addToCart={addToCart} />} />
            <Route path="/shop/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={
              <Cart 
                cart={cart} 
                updateCartQuantity={updateCartQuantity} 
                removeFromCart={removeFromCart} 
              />
            } />
            <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            
            {/* 🔥 購入者ダッシュボード */}
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            
            {/* 🔥 管理者ダッシュボード */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* 🔥 講師ダッシュボード */}
            <Route path="/instructor" element={<InstructorDashboard />} />
            
            {/* 🔥 ブログ管理ダッシュボード */}
            <Route path="/blog-admin" element={<BlogAdmin />} />
            
            <Route path="/purchase-complete" element={<PurchaseComplete />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;