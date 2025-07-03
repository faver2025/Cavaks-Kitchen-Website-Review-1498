import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiHome, FiPackage, FiShoppingBag, FiUsers, FiBarChart3, 
  FiSettings, FiPlus, FiEdit, FiTrash2, FiTruck, FiCheck,
  FiClock, FiDollarSign, FiEye, FiDownload, FiUpload,
  FiImage, FiVideo, FiSave, FiX
} = FiIcons;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    // ローカルストレージからデータを読み込み
    const savedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const savedCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
    
    if (savedProducts.length === 0) {
      // 初期データ
      const mockProducts = [
        {
          id: 1,
          name: 'プロ仕様包丁セット',
          price: 28000,
          stock: 15,
          category: 'tools',
          status: 'active',
          sales: 45,
          image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          description: 'プロの料理人が使用する高品質な包丁セット。切れ味抜群で、長時間の使用でも疲れにくい設計。',
          features: ['高品質ステンレス鋼使用', '人間工学に基づいたハンドル設計', '3本セット', '専用ケース付き'],
          specifications: {
            '材質': 'ステンレス鋼',
            '重量': '約1.2kg',
            '原産国': '日本'
          }
        }
      ];
      setProducts(mockProducts);
      localStorage.setItem('adminProducts', JSON.stringify(mockProducts));
    } else {
      setProducts(savedProducts);
    }

    if (savedCourses.length === 0) {
      const mockCourses = [
        {
          id: 1,
          title: '基礎から学ぶ日本料理',
          price: 29800,
          students: 1250,
          status: 'published',
          rating: 4.8,
          revenue: 37250000,
          instructor: '田中シェフ',
          duration: '8時間',
          description: '日本料理の基本技術を丁寧に学べるコースです。',
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          curriculum: [
            { title: 'だしの基本', duration: '45分', videoUrl: '' },
            { title: '切り方の基本', duration: '60分', videoUrl: '' }
          ]
        }
      ];
      setCourses(mockCourses);
      localStorage.setItem('adminCourses', JSON.stringify(mockCourses));
    } else {
      setCourses(savedCourses);
    }

    const mockOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    setOrders(mockOrders);
  };

  const tabs = [
    { id: 'overview', name: '概要', icon: FiHome },
    { id: 'products', name: '商品管理', icon: FiPackage },
    { id: 'courses', name: 'コース管理', icon: FiShoppingBag },
    { id: 'orders', name: '注文管理', icon: FiTruck },
    { id: 'customers', name: '顧客管理', icon: FiUsers },
    { id: 'analytics', name: '分析', icon: FiBarChart3 },
    { id: 'settings', name: '設定', icon: FiSettings }
  ];

  const stats = [
    { label: '今日の売上', value: '¥156,000', change: '+12%', color: 'text-green-600' },
    { label: '今月の注文数', value: '284', change: '+8%', color: 'text-blue-600' },
    { label: 'アクティブ商品', value: products.length.toString(), change: '+3', color: 'text-purple-600' },
    { label: '受講生数', value: '12,450', change: '+156', color: 'text-orange-600' }
  ];

  // 商品フォーム
  const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      price: product?.price || '',
      stock: product?.stock || '',
      category: product?.category || 'tools',
      description: product?.description || '',
      image: product?.image || '',
      features: product?.features || [''],
      specifications: product?.specifications || {},
      videos: product?.videos || [''],
      status: product?.status || 'active'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newProduct = {
        ...formData,
        id: product?.id || Date.now(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        features: formData.features.filter(f => f.trim() !== ''),
        videos: formData.videos.filter(v => v.trim() !== ''),
        sales: product?.sales || 0
      };
      onSave(newProduct);
    };

    const addFeature = () => {
      setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const updateFeature = (index, value) => {
      setFormData(prev => ({
        ...prev,
        features: prev.features.map((f, i) => i === index ? value : f)
      }));
    };

    const removeFeature = (index) => {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    };

    const addVideo = () => {
      setFormData(prev => ({ ...prev, videos: [...prev.videos, ''] }));
    };

    const updateVideo = (index, value) => {
      setFormData(prev => ({
        ...prev,
        videos: prev.videos.map((v, i) => i === index ? value : v)
      }));
    };

    const removeVideo = (index) => {
      setFormData(prev => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index)
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {product ? '商品編集' : '新商品追加'}
              </h3>
              <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本情報 */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">基本情報</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">商品名 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">価格 *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">在庫数 *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="tools">調理器具</option>
                    <option value="ingredients">食材</option>
                    <option value="books">レシピ本</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="active">販売中</option>
                    <option value="inactive">販売停止</option>
                    <option value="draft">下書き</option>
                  </select>
                </div>
              </div>

              {/* メディア */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">メディア</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">メイン画像URL *</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    required
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img src={formData.image} alt="プレビュー" className="w-32 h-32 object-cover rounded-lg" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">商品動画</label>
                  {formData.videos.map((video, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="url"
                        value={video}
                        onChange={(e) => updateVideo(index, e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <SafeIcon icon={FiX} className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addVideo}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                    動画を追加
                  </button>
                </div>
              </div>
            </div>

            {/* 詳細情報 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">商品説明 *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* 特徴 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">商品特徴</label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="特徴を入力..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                特徴を追加
              </button>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="w-4 h-4" />
                <span>保存</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // コースフォーム
  const CourseForm = ({ course, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      title: course?.title || '',
      price: course?.price || '',
      instructor: course?.instructor || '',
      duration: course?.duration || '',
      description: course?.description || '',
      image: course?.image || '',
      curriculum: course?.curriculum || [{ title: '', duration: '', videoUrl: '' }],
      status: course?.status || 'draft'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newCourse = {
        ...formData,
        id: course?.id || Date.now(),
        price: parseFloat(formData.price),
        curriculum: formData.curriculum.filter(c => c.title.trim() !== ''),
        students: course?.students || 0,
        rating: course?.rating || 0,
        revenue: course?.revenue || 0
      };
      onSave(newCourse);
    };

    const addLesson = () => {
      setFormData(prev => ({
        ...prev,
        curriculum: [...prev.curriculum, { title: '', duration: '', videoUrl: '' }]
      }));
    };

    const updateLesson = (index, field, value) => {
      setFormData(prev => ({
        ...prev,
        curriculum: prev.curriculum.map((lesson, i) => 
          i === index ? { ...lesson, [field]: value } : lesson
        )
      }));
    };

    const removeLesson = (index) => {
      setFormData(prev => ({
        ...prev,
        curriculum: prev.curriculum.filter((_, i) => i !== index)
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {course ? 'コース編集' : '新コース作成'}
              </h3>
              <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本情報 */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">基本情報</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">コースタイトル *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">価格 *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">総時間</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="8時間"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">講師名 *</label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="draft">下書き</option>
                    <option value="published">公開</option>
                    <option value="private">非公開</option>
                  </select>
                </div>
              </div>

              {/* メディア */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">メディア</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">コース画像URL *</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    required
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img src={formData.image} alt="プレビュー" className="w-32 h-32 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 詳細情報 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">コース説明 *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* カリキュラム */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">カリキュラム</label>
              {formData.curriculum.map((lesson, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">レッスンタイトル</label>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => updateLesson(index, 'title', e.target.value)}
                        placeholder="レッスン名を入力..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">時間</label>
                      <input
                        type="text"
                        value={lesson.duration}
                        onChange={(e) => updateLesson(index, 'duration', e.target.value)}
                        placeholder="45分"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeLesson(index)}
                        className="w-full text-red-600 hover:text-red-800 border border-red-300 rounded-lg py-2 flex items-center justify-center"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">動画URL</label>
                    <input
                      type="url"
                      value={lesson.videoUrl}
                      onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addLesson}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                <span>レッスンを追加</span>
              </button>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="w-4 h-4" />
                <span>保存</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSaveProduct = (productData) => {
    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? productData : p);
    } else {
      updatedProducts = [...products, productData];
    }
    setProducts(updatedProducts);
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleSaveCourse = (courseData) => {
    let updatedCourses;
    if (editingCourse) {
      updatedCourses = courses.map(c => c.id === editingCourse.id ? courseData : c);
    } else {
      updatedCourses = [...courses, courseData];
    }
    setCourses(updatedCourses);
    localStorage.setItem('adminCourses', JSON.stringify(updatedCourses));
    setShowCourseForm(false);
    setEditingCourse(null);
  };

  const handleDeleteProduct = (productId) => {
    if (confirm('この商品を削除しますか？')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    }
  };

  const handleDeleteCourse = (courseId) => {
    if (confirm('このコースを削除しますか？')) {
      const updatedCourses = courses.filter(c => c.id !== courseId);
      setCourses(updatedCourses);
      localStorage.setItem('adminCourses', JSON.stringify(updatedCourses));
    }
  };

  const updateOrderStatus = (orderId, field, status) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, [field]: status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">管理者ダッシュボード</h1>
          <p className="text-gray-600">Cavak's Kitchen 管理システム</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="w-5 h-5" />
                    <span className="text-sm">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg p-6"
                    >
                      <h3 className="text-sm text-gray-600 mb-2">{stat.label}</h3>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">最近の注文</h3>
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
                            <td className="py-3 font-mono text-xs">{order.id.slice(-8)}</td>
                            <td className="py-3">{order.customer}</td>
                            <td className="py-3">¥{order.total.toLocaleString()}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status === 'completed' ? '完了' : 
                                 order.status === 'pending' ? '処理中' : '準備中'}
                              </span>
                            </td>
                            <td className="py-3">{new Date(order.orderDate).toLocaleDateString('ja-JP')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">商品管理</h2>
                  <button 
                    onClick={() => setShowProductForm(true)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    <span>新商品追加</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4">商品</th>
                          <th className="text-left p-4">価格</th>
                          <th className="text-left p-4">在庫</th>
                          <th className="text-left p-4">ステータス</th>
                          <th className="text-left p-4">アクション</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-gray-600">{product.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">¥{product.price.toLocaleString()}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                product.stock > 20 ? 'bg-green-100 text-green-800' :
                                product.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {product.stock}個
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                product.status === 'active' ? 'bg-green-100 text-green-800' :
                                product.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {product.status === 'active' ? '販売中' :
                                 product.status === 'inactive' ? '販売停止' : '下書き'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setShowProductForm(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <SafeIcon icon={FiEdit} className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">コース管理</h2>
                  <button 
                    onClick={() => setShowCourseForm(true)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    <span>新コース作成</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            course.status === 'published' ? 'bg-green-100 text-green-800' :
                            course.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {course.status === 'published' ? '公開中' :
                             course.status === 'draft' ? '下書き' : '非公開'}
                          </span>
                        </div>
                      </div>

                      {course.image && (
                        <img src={course.image} alt={course.title} className="w-full h-32 object-cover rounded-lg mb-4" />
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">受講生数</p>
                          <p className="text-xl font-bold text-gray-900">{course.students?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">価格</p>
                          <p className="text-lg font-semibold text-gray-900">¥{course.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">講師</p>
                          <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">時間</p>
                          <p className="text-sm font-medium text-gray-900">{course.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setEditingCourse(course);
                            setShowCourseForm(true);
                          }}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center space-x-1"
                        >
                          <SafeIcon icon={FiEdit} className="w-4 h-4" />
                          <span>編集</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="flex-1 border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 text-sm flex items-center justify-center space-x-1"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          <span>削除</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">注文管理</h2>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex items-center space-x-4">
                      <select className="px-4 py-2 border border-gray-300 rounded-lg">
                        <option>全ステータス</option>
                        <option>処理中</option>
                        <option>発送準備中</option>
                        <option>発送済み</option>
                        <option>完了</option>
                      </select>
                      <input
                        type="text"
                        placeholder="注文ID、顧客名で検索"
                        className="px-4 py-2 border border-gray-300 rounded-lg flex-1"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4">注文情報</th>
                          <th className="text-left p-4">顧客</th>
                          <th className="text-left p-4">商品</th>
                          <th className="text-left p-4">金額</th>
                          <th className="text-left p-4">決済</th>
                          <th className="text-left p-4">配送</th>
                          <th className="text-left p-4">アクション</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b">
                            <td className="p-4">
                              <div>
                                <p className="font-mono text-sm">{order.id.slice(-8)}</p>
                                <p className="text-xs text-gray-600">
                                  {new Date(order.orderDate).toLocaleDateString('ja-JP')}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{order.customer}</p>
                                <p className="text-sm text-gray-600">{order.email}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                {order.items.map((item, index) => (
                                  <p key={index} className="text-sm">
                                    {item.name} × {item.quantity}
                                  </p>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="font-semibold">¥{order.total.toLocaleString()}</p>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.paymentStatus === 'paid' ? '決済済み' : '未決済'}
                              </span>
                            </td>
                            <td className="p-4">
                              <select
                                value={order.shippingStatus}
                                onChange={(e) => updateOrderStatus(order.id, 'shippingStatus', e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="preparing">準備中</option>
                                <option value="shipped">発送済み</option>
                                <option value="delivered">配達完了</option>
                              </select>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-600 hover:text-blue-800">
                                  <SafeIcon icon={FiEye} className="w-4 h-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-800">
                                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">分析・レポート</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">売上推移</h3>
                    <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">グラフエリア</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">人気商品</h3>
                    <div className="space-y-3">
                      {products.slice(0, 3).map((product) => (
                        <div key={product.id} className="flex justify-between">
                          <span className="text-sm">{product.name}</span>
                          <span className="text-sm font-semibold">{product.sales || 0}個</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">顧客分析</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">新規顧客</span>
                        <span className="text-sm font-semibold">156人</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">リピート率</span>
                        <span className="text-sm font-semibold">68%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showProductForm && (
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }}
          />
        )}

        {showCourseForm && (
          <CourseForm
            course={editingCourse}
            onSave={handleSaveCourse}
            onCancel={() => {
              setShowCourseForm(false);
              setEditingCourse(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;