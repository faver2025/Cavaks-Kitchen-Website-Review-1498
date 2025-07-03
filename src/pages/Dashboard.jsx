import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiShoppingBag, FiPlay, FiSettings, FiDownload, FiStar, FiClock, FiCreditCard } = FiIcons;

const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    // ローカルストレージから購入履歴を読み込み
    const history = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
    setPurchaseHistory(history);
  }, []);

  const tabs = [
    { id: 'overview', name: '概要', icon: FiUser },
    { id: 'courses', name: '受講中コース', icon: FiPlay },
    { id: 'purchases', name: '購入履歴', icon: FiShoppingBag },
    { id: 'settings', name: '設定', icon: FiSettings }
  ];

  const myCourses = [
    {
      id: 1,
      title: '基礎から学ぶ日本料理',
      progress: 75,
      instructor: '田中シェフ',
      nextLesson: 'だしの取り方',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      title: 'プロのパスタ技術',
      progress: 45,
      instructor: '佐藤シェフ',
      nextLesson: 'カルボナーラの作り方',
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const achievements = [
    { name: '初回購入', description: '最初のコースを購入しました', earned: purchaseHistory.length > 0 },
    { name: 'コース完了', description: '1つのコースを完了しました', earned: false },
    { name: '料理マスター', description: '5つのコースを完了しました', earned: false }
  ];

  const downloadReceipt = (purchaseId) => {
    // 領収書ダウンロード機能（模擬実装）
    alert(`領収書をダウンロードします: ${purchaseId}`);
  };

  const totalSpent = purchaseHistory.reduce((sum, purchase) => sum + purchase.total, 0);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ダッシュボード
          </h1>
          <p className="text-xl text-gray-600">
            おかえりなさい、{user?.name || 'ゲスト'}さん
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">受講中コース</p>
                        <p className="text-2xl font-bold text-gray-900">2</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <SafeIcon icon={FiPlay} className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">購入履歴</p>
                        <p className="text-2xl font-bold text-gray-900">{purchaseHistory.length}</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <SafeIcon icon={FiShoppingBag} className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">学習時間</p>
                        <p className="text-2xl font-bold text-gray-900">24h</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <SafeIcon icon={FiClock} className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">総支払額</p>
                        <p className="text-2xl font-bold text-gray-900">¥{totalSpent.toLocaleString()}</p>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <SafeIcon icon={FiCreditCard} className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">最近の活動</h3>
                  <div className="space-y-4">
                    {purchaseHistory.slice(-3).map((purchase, index) => (
                      <div key={purchase.id} className="flex items-center space-x-4">
                        <div className="bg-green-100 p-2 rounded-full">
                          <SafeIcon icon={FiShoppingBag} className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {purchase.items.length}点の商品を購入 - ¥{purchase.total.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(purchase.date).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                    ))}
                    {purchaseHistory.length === 0 && (
                      <p className="text-gray-600">まだ購入履歴がありません</p>
                    )}
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">達成バッジ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          achievement.earned
                            ? 'border-yellow-400 bg-yellow-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <SafeIcon
                            icon={FiStar}
                            className={`w-6 h-6 ${
                              achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                            }`}
                          />
                          <div>
                            <p className="font-medium">{achievement.name}</p>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'purchases' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">購入履歴</h3>
                  
                  {purchaseHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <SafeIcon icon={FiShoppingBag} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">まだ購入履歴がありません</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {purchaseHistory.map((purchase) => (
                        <div key={purchase.id} className="border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="font-medium text-lg">
                                注文番号: {purchase.id.slice(-8)}
                              </p>
                              <p className="text-sm text-gray-600">
                                注文日: {new Date(purchase.date).toLocaleDateString('ja-JP')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-xl text-red-600">
                                ¥{purchase.total.toLocaleString()}
                              </p>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                purchase.status === '完了'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {purchase.status}
                              </span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium mb-2">購入商品:</h4>
                            <div className="space-y-2">
                              {purchase.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>
                                    {item.name} × {item.quantity}
                                    <span className="text-gray-500 ml-2">
                                      ({item.type === 'course' ? 'コース' : '商品'})
                                    </span>
                                  </span>
                                  <span>¥{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-gray-600">
                                <p>決済方法: {purchase.paymentMethod}</p>
                                <p>お客様名: {purchase.customerInfo?.name}</p>
                              </div>
                              <button
                                onClick={() => downloadReceipt(purchase.id)}
                                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                              >
                                <SafeIcon icon={FiDownload} className="w-4 h-4" />
                                <span>領収書</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">受講中のコース</h3>
                  <div className="space-y-6">
                    {myCourses.map((course) => (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{course.title}</h4>
                            <p className="text-sm text-gray-600">講師: {course.instructor}</p>
                            <p className="text-sm text-gray-600">次のレッスン: {course.nextLesson}</p>
                            <div className="mt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">進捗</span>
                                <span className="text-sm font-medium">{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-red-600 h-2 rounded-full"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            続きを見る
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">アカウント設定</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        名前
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        メールアドレス
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        パスワード
                      </label>
                      <input
                        type="password"
                        placeholder="新しいパスワード"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      設定を保存
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;