import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiChevronDown } = FiIcons;

const Navbar = ({ user, cartCount, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();

  const navItems = [
    { name: 'ホーム', path: '/' },
    { name: 'オンラインコース', path: '/courses' },
    { name: 'ショップ', path: '/shop' },
    { name: 'ブログ', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'お問い合わせ', path: '/contact' }
  ];

  // クリック外しで閉じる処理
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    setShowUserMenu(false);
  };

  const toggleUserMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggling user menu:', !showUserMenu); // デバッグ用
    setShowUserMenu(!showUserMenu);
  };

  const closeUserMenu = () => {
    setShowUserMenu(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="https://cavaks-kitchen.com/wp-content/uploads/2024/01/logo-1.png"
              alt="Cavak's Kitchen"
              className="h-10 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="text-2xl font-bold text-orange-600" style={{ display: 'none' }}>
              Cavak's Kitchen
            </div>
          </Link>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-orange-600'
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <SafeIcon icon={FiShoppingCart} className="w-6 h-6 text-gray-700 hover:text-orange-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 bg-gray-100 px-3 py-2 rounded-lg transition-colors cursor-pointer select-none"
                  style={{ userSelect: 'none' }}
                >
                  <SafeIcon icon={FiUser} className="w-5 h-5" />
                  <span className="hidden sm:block font-medium">{user.name}</span>
                  <SafeIcon 
                    icon={FiChevronDown} 
                    className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : 'rotate-0'}`} 
                  />
                </button>
                
                {/* ダッシュボードドロップダウンメニュー */}
                <div 
                  className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-200 ${
                    showUserMenu 
                      ? 'opacity-100 visible transform translate-y-0 z-[9999]' 
                      : 'opacity-0 invisible transform -translate-y-2 z-[-1]'
                  }`}
                  style={{
                    position: 'absolute',
                    zIndex: showUserMenu ? 9999 : -1,
                    right: 0,
                    top: '100%',
                    marginTop: '0.5rem'
                  }}
                >
                  <div className="p-3">
                    {/* ユーザー情報 */}
                    <div className="px-3 py-3 border-b border-gray-100 mb-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-orange-600 mt-1">ログイン中</p>
                    </div>
                    
                    {/* メニュー項目 */}
                    <div className="space-y-1">
                      <Link
                        to="/dashboard"
                        onClick={closeUserMenu}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors group"
                      >
                        <span className="mr-3 text-base">📊</span>
                        <span className="font-medium">購入者ダッシュボード</span>
                      </Link>
                      
                      <Link
                        to="/instructor"
                        onClick={closeUserMenu}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors group"
                      >
                        <span className="mr-3 text-base">👨‍🍳</span>
                        <span className="font-medium">講師ダッシュボード</span>
                      </Link>
                      
                      <Link
                        to="/admin"
                        onClick={closeUserMenu}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors group"
                      >
                        <span className="mr-3 text-base">🔧</span>
                        <span className="font-medium">管理者ダッシュボード</span>
                      </Link>
                      
                      <Link
                        to="/blog-admin"
                        onClick={closeUserMenu}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors group"
                      >
                        <span className="mr-3 text-base">✍️</span>
                        <span className="font-medium">ブログ管理</span>
                      </Link>
                    </div>
                    
                    {/* ログアウト */}
                    <div className="border-t border-gray-100 mt-3 pt-3">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                      >
                        <SafeIcon icon={FiLogOut} className="w-4 h-4 mr-3" />
                        <span className="font-medium">ログアウト</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                ログイン
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700"
            >
              <SafeIcon icon={isOpen ? FiX : FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white shadow-lg border-t"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-lg ${
                  location.pathname === item.path
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* モバイル用ダッシュボードメニュー */}
            {user ? (
              <div className="border-t pt-3 mt-3">
                <div className="px-3 py-2 mb-2 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                >
                  <span className="mr-3">📊</span>
                  購入者ダッシュボード
                </Link>
                <Link
                  to="/instructor"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                >
                  <span className="mr-3">👨‍🍳</span>
                  講師ダッシュボード
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                >
                  <span className="mr-3">🔧</span>
                  管理者ダッシュボード
                </Link>
                <Link
                  to="/blog-admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                >
                  <span className="mr-3">✍️</span>
                  ブログ管理
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg mt-2"
                >
                  <SafeIcon icon={FiLogOut} className="w-4 h-4 mr-3" />
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="border-t pt-3 mt-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
                >
                  ログイン
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;