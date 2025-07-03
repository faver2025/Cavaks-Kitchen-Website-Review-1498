import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiClock, FiUsers, FiStar } = FiIcons;

const Courses = ({ addToCart }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // 管理者が作成したコースを読み込み
    const savedCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
    
    if (savedCourses.length === 0) {
      // 初期データ
      const defaultCourses = [
        {
          id: 1,
          title: '基礎から学ぶ日本料理',
          instructor: '田中シェフ',
          duration: '8時間',
          students: 1250,
          rating: 4.8,
          price: 29800,
          category: 'basic',
          status: 'published',
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          description: '日本料理の基本技術を丁寧に学べるコース'
        },
        {
          id: 2,
          title: 'プロのパスタ技術',
          instructor: '佐藤シェフ',
          duration: '6時間',
          students: 980,
          rating: 4.9,
          price: 24800,
          category: 'specialty',
          status: 'published',
          image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          description: '本格的なパスタ作りの技術を習得'
        }
      ];
      setCourses(defaultCourses);
      localStorage.setItem('adminCourses', JSON.stringify(defaultCourses));
    } else {
      // 公開されているコースのみ表示
      setCourses(savedCourses.filter(course => course.status === 'published'));
    }
  }, []);

  const categories = [
    { id: 'all', name: 'すべて' },
    { id: 'basic', name: '基礎コース' },
    { id: 'advanced', name: '上級コース' },
    { id: 'specialty', name: '専門コース' }
  ];

  const filteredCourses = activeCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            オンラインコース
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            プロの料理人から学ぶ本格的な料理技術
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center mb-8 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                activeCategory === category.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-red-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-sm">
                  ¥{course.price.toLocaleString()}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <SafeIcon icon={FiUsers} className="w-4 h-4 mr-1" />
                      {course.students}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  講師: {course.instructor}
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/courses/${course.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors"
                  >
                    詳細を見る
                  </Link>
                  <button
                    onClick={() => addToCart({ ...course, type: 'course' })}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    カートに追加
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {activeCategory === 'all' 
                ? 'まだコースが登録されていません。' 
                : 'このカテゴリのコースは現在ありません。'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;