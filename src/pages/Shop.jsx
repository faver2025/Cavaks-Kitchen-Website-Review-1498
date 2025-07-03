import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiHeart } = FiIcons;

const Shop = ({ addToCart }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 管理者が作成した商品を読み込み
    const savedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    
    if (savedProducts.length === 0) {
      // 初期データ
      const defaultProducts = [
        {
          id: 1,
          name: 'プロ仕様包丁セット',
          price: 28000,
          rating: 4.9,
          reviews: 156,
          category: 'tools',
          status: 'active',
          image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          description: 'プロの料理人が使用する高品質な包丁セット'
        },
        {
          id: 2,
          name: '高級オリーブオイル',
          price: 3800,
          rating: 4.7,
          reviews: 89,
          category: 'ingredients',
          status: 'active',
          image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          description: 'イタリア産エクストラバージンオリーブオイル'
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('adminProducts', JSON.stringify(defaultProducts));
    } else {
      // 販売中の商品のみ表示
      setProducts(savedProducts.filter(product => product.status === 'active'));
    }
  }, []);

  const categories = [
    { id: 'all', name: 'すべて' },
    { id: 'tools', name: '調理器具' },
    { id: 'ingredients', name: '食材' },
    { id: 'books', name: 'レシピ本' }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

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
            オンラインショップ
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            厳選された料理器具と食材をお届け
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

        {/* Products Grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <SafeIcon icon={FiHeart} className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-red-600">
                    ¥{product.price.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{product.rating || 4.5}</span>
                    <span className="text-sm text-gray-500 ml-1">({product.reviews || 0})</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/shop/${product.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors"
                  >
                    詳細を見る
                  </Link>
                  <button
                    onClick={() => addToCart({ ...product, type: 'product' })}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    カートに追加
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {activeCategory === 'all' 
                ? 'まだ商品が登録されていません。' 
                : 'このカテゴリの商品は現在ありません。'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;