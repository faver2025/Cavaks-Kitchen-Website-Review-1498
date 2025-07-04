import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiPlay, FiDollarSign, FiTrendingUp, FiUsers, FiBook, FiSettings, FiPlus, FiEdit, FiEye, FiDownload } = FiIcons;

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [instructorData, setInstructorData] = useState({
    name: '田中シェフ',
    email: 'tanaka@cavaks-kitchen.com',
    totalStudents: 2450,
    totalCourses: 8,
    monthlyRevenue: 486000,
    averageRating: 4.8
  });

  const [courses, setCourses] = useState([]);
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    loadInstructorData();
  }, []);

  const loadInstructorData = () => {
    // 講師のコースデータを読み込み
    const savedCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
    const instructorCourses = savedCourses.filter(course => course.instructor === instructorData.name);
    setCourses(instructorCourses);

    // 収益データ（模擬）
    const mockEarnings = [
      { month: '2024-01', revenue: 420000, students: 156 },
      { month: '2024-02', revenue: 380000, students: 142 },
      { month: '2024-03', revenue: 450000, students: 178 },
      { month: '2024-04', revenue: 486000, students: 195 },
    ];
    setEarnings(mockEarnings);
  };

  const tabs = [
    { id: 'overview', name: '概要', icon: FiUser },
    { id: 'courses', name: 'コース管理', icon: FiPlay },
    { id: 'students', name: '受講生', icon: FiUsers },
    { id: 'earnings', name: '収益', icon: FiDollarSign },
    { id: 'analytics', name: '分析', icon: FiTrendingUp },
    { id: 'settings', name: '設定', icon: FiSettings }
  ];

  const recentActivities = [
    { type: 'enrollment', message: '新しい受講生が「基礎から学ぶ日本料理」に登録しました', time: '2時間前' },
    { type: 'completion', message: '山田さんが「だしの基本」レッスンを完了しました', time: '4時間前' },
    { type: 'review', message: '新しい5つ星レビューを受け取りました', time: '6時間前' },
    { type: 'question', message: '佐藤さんから質問が届いています', time: '1日前' }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">講師ダッシュボード</h1>
          <p className="text-xl text-gray-600">おかえりなさい、{instructorData.name}さん</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiUser} className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{instructorData.name}</h3>
                <p className="text-sm text-gray-600">プロ料理講師</p>
                <div className="flex items-center justify-center mt-2">
                  <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{instructorData.averageRating}</span>
                </div>
              </div>

              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-orange-600 text-white'
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
                        <p className="text-sm text-gray-600">総受講生数</p>
                        <p className="text-2xl font-bold text-gray-900">{instructorData.totalStudents.toLocaleString()}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">コース数</p>
                        <p className="text-2xl font-bold text-gray-900">{instructorData.totalCourses}</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <SafeIcon icon={FiBook} className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">今月の収益</p>
                        <p className="text-2xl font-bold text-gray-900">¥{instructorData.monthlyRevenue.toLocaleString()}</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">平均評価</p>
                        <p className="text-2xl font-bold text-gray-900">{instructorData.averageRating}</p>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">最近の活動</h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'enrollment' ? 'bg-blue-100' :
                          activity.type === 'completion' ? 'bg-green-100' :
                          activity.type === 'review' ? 'bg-yellow-100' : 'bg-purple-100'
                        }`}>
                          <SafeIcon icon={
                            activity.type === 'enrollment' ? FiUsers :
                            activity.type === 'completion' ? FiPlay :
                            activity.type === 'review' ? FiTrendingUp : FiUser
                          } className={`w-4 h-4 ${
                            activity.type === 'enrollment' ? 'text-blue-600' :
                            activity.type === 'completion' ? 'text-green-600' :
                            activity.type === 'review' ? 'text-yellow-600' : 'text-purple-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">{activity.message}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">クイックアクション</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors">
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                      <span>新コース作成</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      <SafeIcon icon={FiEye} className="w-4 h-4" />
                      <span>受講生管理</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                      <SafeIcon icon={FiDownload} className="w-4 h-4" />
                      <span>収益レポート</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">コース管理</h2>
                  <Link to="/admin" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2">
                    <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    <span>新コース作成</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                          <p className="text-gray-600">{course.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-500">受講生: {course.students || 0}人</span>
                            <span className="text-sm text-gray-500">評価: {course.rating || 4.5}</span>
                            <span className="text-lg font-bold text-orange-600">¥{course.price.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                            編集
                          </button>
                          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
                            統計
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">収益管理</h2>
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">月別収益</h3>
                  <div className="space-y-4">
                    {earnings.map((earning, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(earning.month).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
                          </p>
                          <p className="text-sm text-gray-600">新規受講生: {earning.students}人</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-orange-600">¥{earning.revenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">収益</p>
                        </div>
                      </div>
                    ))}
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

export default InstructorDashboard;