import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { dbOperations } from '../lib/supabase';

const { FiHome, FiPackage, FiShoppingBag, FiUsers, FiBarChart3, FiSettings, FiPlus, FiEdit, FiTrash2 } = FiIcons;

const EnhancedAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    loadAllData();
    
    // オンライン/オフラインの検出
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [productsData, coursesData, ordersData] = await Promise.all([
        dbOperations.getProducts(),
        dbOperations.getCourses(),
        dbOperations.getOrders()
      ]);
      
      setProducts(productsData);
      setCourses(coursesData);
      setOrders(ordersData);
    } catch (error) {
      console.error('データ読み込みエラー:', error);
      // フォールバックとしてローカルストレージから読み込み
      const localProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
      const localCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
      const localOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
      
      setProducts(localProducts);
      setCourses(localCourses);
      setOrders(localOrders);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const exportData = {
      products,
      courses,
      orders,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `cavaks-kitchen-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (importedData.products) {
          setProducts(importedData.products);
          localStorage.setItem('adminProducts', JSON.stringify(importedData.products));
        }
        
        if (importedData.courses) {
          setCourses(importedData.courses);
          localStorage.setItem('adminCourses', JSON.stringify(importedData.courses));
        }
        
        if (importedData.orders) {
          setOrders(importedData.orders);
          localStorage.setItem('adminOrders', JSON.stringify(importedData.orders));
        }
        
        alert('データのインポートが完了しました');
      } catch (error) {
        alert('ファイルの形式が正しくありません');
      }
    };
    reader.readAsText(file);
  };

  const stats = {
    totalProducts: products.length,
    totalCourses: courses.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0)
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">管理データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">管理者ダッシュボード</h1>
              <p className="text-gray-600">Cavak's Kitchen 管理システム</p>
            </div>
            
            {/* 接続状態とデータ操作 */}
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isOnline ? 'オンライン' : 'オフライン'}
              </div>
              
              <button
                onClick={exportData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                データエクスポート
              </button>
              
              <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                データインポート
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </motion.div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">商品数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <SafeIcon icon={FiPackage} className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">コース数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <SafeIcon icon={FiShoppingBag} className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">注文数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <SafeIcon icon={FiUsers} className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総売上</p>
                <p className="text-2xl font-bold text-gray-900">¥{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <SafeIcon icon={FiBarChart3} className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* クイックアクション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>新商品追加</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>新コース作成</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
              <SafeIcon icon={FiBarChart3} className="w-4 h-4" />
              <span>売上レポート</span>
            </button>
          </div>
        </motion.div>

        {/* 最近の活動 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近の注文</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">注文ID</th>
                  <th className="text-left py-2">顧客</th>
                  <th className="text-left py-2">金額</th>
                  <th className="text-left py-2">ステータス</th>
                  <th className="text-left py-2">日時</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3 font-mono text-xs">{order.id.toString().slice(-8)}</td>
                    <td className="py-3">{order.customer || 'ゲスト'}</td>
                    <td className="py-3">¥{(order.total || 0).toLocaleString()}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {order.status || '完了'}
                      </span>
                    </td>
                    <td className="py-3">{new Date(order.orderDate || Date.now()).toLocaleDateString('ja-JP')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedAdminDashboard;