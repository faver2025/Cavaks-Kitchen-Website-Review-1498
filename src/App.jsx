import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

// Context
import { ThemeProvider } from './context/ThemeContext';

// Auth
import { authService } from './lib/supabase';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 認証状態を初期化
    initializeAuth();

    // 認証状態の変更を監視
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session); // デバッグ用
      if (event === 'SIGNED_IN') {
        setUser(session?.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // カートをローカルストレージから読み込み
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      const { data } = await authService.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        console.log('User loaded:', data.session.user); // デバッグ用
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // カートの変更をローカルストレージに保存
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      console.log('Logged out successfully'); // デバッグ用
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        cartItem => cartItem.id === item.id && cartItem.type === item.type
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
      prevCart.filter(item => !(item.id === itemId && item.type === itemType))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar 
            user={user} 
            cartCount={cartCount} 
            onLogout={handleLogout} 
          />
          
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
              <Route
                path="/cart"
                element={
                  <Cart
                    cart={cart}
                    updateCartQuantity={updateCartQuantity}
                    removeFromCart={removeFromCart}
                  />
                }
              />
              <Route
                path="/checkout"
                element={<Checkout cart={cart} clearCart={clearCart} />}
              />

              {/* 認証ページ */}
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />

              {/* ダッシュボード系ページ */}
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/instructor" element={<InstructorDashboard />} />
              <Route path="/blog-admin" element={<BlogAdmin />} />
              <Route path="/purchase-complete" element={<PurchaseComplete />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;