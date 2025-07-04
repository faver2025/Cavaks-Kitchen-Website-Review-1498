import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 簡単ログイン実装
    const userData = {
      name: 'テストユーザー',
      email: formData.email,
      role: 'user' // user, instructor, admin
    };
    
    // ローカルストレージに保存
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    alert('ログインしました！');
    navigate('/dashboard');
  };

  // デモ用の簡単ログインボタン
  const handleDemoLogin = (role, name) => {
    const userData = {
      name: name,
      email: `${role}@cavaks-kitchen.com`,
      role: role
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    alert(`${name}としてログインしました！`);
    
    // 役割に応じてリダイレクト
    switch(role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'instructor':
        navigate('/instructor');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ログイン</h1>
          <p className="text-gray-600">アカウントにログインしてください</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              パスワード
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="パスワードを入力"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
          >
            ログイン
          </button>
        </form>

        {/* デモ用簡単ログイン */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            🚀 デモ用クイックログイン
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => handleDemoLogin('user', '購入者ユーザー')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              📊 購入者としてログイン
            </button>
            <button
              onClick={() => handleDemoLogin('instructor', '田中シェフ')}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              👨‍🍳 講師としてログイン
            </button>
            <button
              onClick={() => handleDemoLogin('admin', '管理者')}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              🔧 管理者としてログイン
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            アカウントをお持ちでない方は{' '}
            <Link to="/register" className="text-orange-600 hover:text-orange-700 font-medium">
              新規登録
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;