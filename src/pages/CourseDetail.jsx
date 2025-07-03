import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiClock, FiUsers, FiStar, FiCheck } = FiIcons;

const CourseDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    // 管理者が作成したコースから詳細を取得
    const savedCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
    const foundCourse = savedCourses.find(c => c.id === parseInt(id));
    
    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      // フォールバック用のモックデータ
      setCourse({
        id: parseInt(id),
        title: '基礎から学ぶ日本料理',
        instructor: '田中シェフ',
        duration: '8時間',
        students: 1250,
        rating: 4.8,
        price: 29800,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        description: '日本料理の基本技術を丁寧に学べるコースです。だしの取り方から基本的な調理法まで、プロの技術を身につけることができます。',
        features: [
          '8時間の詳細な動画レッスン',
          '実践的な調理技術',
          '質問サポート',
          '修了証明書',
          '永久アクセス'
        ],
        curriculum: [
          { title: 'だしの基本', duration: '45分', videoUrl: '' },
          { title: '切り方の基本', duration: '60分', videoUrl: '' },
          { title: '煮物の技術', duration: '90分', videoUrl: '' },
          { title: '焼き物の技術', duration: '75分', videoUrl: '' },
          { title: '蒸し物の技術', duration: '60分', videoUrl: '' },
          { title: '揚げ物の技術', duration: '90分', videoUrl: '' }
        ]
      });
    }
  }, [id]);

  if (!course) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">コース情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-500 mr-2" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiUsers} className="w-5 h-5 text-gray-500 mr-2" />
                  <span>{course.students}人受講</span>
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiStar} className="w-5 h-5 text-yellow-400 mr-2" />
                  <span>{course.rating}</span>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 mb-8">{course.description}</p>
              
              {course.features && (
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    このコースで学べること
                  </h3>
                  <ul className="space-y-2">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {course.curriculum && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    カリキュラム
                  </h3>
                  <div className="space-y-3">
                    {course.curriculum.map((lesson, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <SafeIcon icon={FiPlay} className="w-5 h-5 text-red-600 mr-3" />
                            <span className="font-medium">{lesson.title}</span>
                          </div>
                          <span className="text-gray-500">{lesson.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-24"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  ¥{course.price.toLocaleString()}
                </div>
                <p className="text-gray-600">買い切り価格</p>
              </div>
              
              <button
                onClick={() => addToCart({ ...course, type: 'course' })}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold mb-4"
              >
                カートに追加
              </button>
              
              <button className="w-full border border-red-600 text-red-600 py-3 rounded-lg hover:bg-red-50 transition-colors font-semibold">
                今すぐ購入
              </button>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">講師情報</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-medium">{course.instructor}</p>
                    <p className="text-sm text-gray-600">プロ料理人</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">含まれるもの</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                    動画レッスン
                  </li>
                  <li className="flex items-center">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                    永久アクセス
                  </li>
                  <li className="flex items-center">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                    修了証明書
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;