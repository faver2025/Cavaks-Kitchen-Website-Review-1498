import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { generateRecommendations, complementaryProductRecommendations } from '../utils/recommendationEngine';

const { FiStar, FiTrendingUp, FiHeart, FiShoppingCart, FiEye, FiClock } = FiIcons;

const RecommendationSection = ({ 
  user, 
  currentItem, 
  cart = [], 
  allItems = [], 
  allUsers = [], 
  type = 'general',
  title,
  addToCart,
  className = ''
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('for_you');

  useEffect(() => {
    generateRecommendationData();
  }, [user, currentItem, cart, allItems, type]);

  const generateRecommendationData = async () => {
    setLoading(true);
    
    try {
      let recs = [];
      
      switch (type) {
        case 'product_detail':
          // 商品詳細ページでの関連商品推薦
          recs = await getRelatedProducts(currentItem);
          break;
        case 'cart':
          // カートページでの補完商品推薦
          recs = complementaryProductRecommendations(cart, getUserPurchaseHistory());
          break;
        case 'checkout':
          // チェックアウトページでの最後の提案
          recs = await getLastChanceRecommendations(cart);
          break;
        default:
          // 一般的な推薦
          recs = generateRecommendations(user, allItems, allUsers, {
            limit: 12
          });
      }
      
      setRecommendations(recs);
    } catch (error) {
      console.error('推薦生成エラー:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const getRelatedProducts = async (item) => {
    if (!item) return [];
    
    // 同じカテゴリの商品
    const sameCategory = allItems.filter(p => 
      p.id !== item.id && 
      p.category === item.category &&
      p.status === 'active'
    );
    
    // 価格帯が近い商品
    const similarPrice = allItems.filter(p => 
      p.id !== item.id &&
      Math.abs(p.price - item.price) < item.price * 0.5 &&
      p.status === 'active'
    );
    
    // 評価が高い商品
    const highRated = allItems.filter(p => 
      p.id !== item.id &&
      (p.rating || 0) >= 4.5 &&
      p.status === 'active'
    );
    
    const combined = [...sameCategory, ...similarPrice, ...highRated];
    const unique = combined.reduce((acc, item) => {
      if (!acc.find(i => i.id === item.id)) {
        acc.push({
          ...item,
          reason: sameCategory.includes(item) ? 'same_category' : 
                  similarPrice.includes(item) ? 'similar_price' : 'high_rated'
        });
      }
      return acc;
    }, []);
    
    return unique.slice(0, 8);
  };

  const getLastChanceRecommendations = async (cartItems) => {
    // カートの商品と相性の良い商品を推薦
    const complementary = complementaryProductRecommendations(cartItems, getUserPurchaseHistory());
    
    // 人気商品で安価なもの
    const popularLowPrice = allItems
      .filter(item => 
        item.price < 5000 && 
        (item.rating || 0) >= 4.0 &&
        !cartItems.some(c => c.id === item.id)
      )
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, 4)
      .map(item => ({ ...item, reason: 'popular_addon' }));
    
    return [...complementary, ...popularLowPrice].slice(0, 6);
  };

  const getUserPurchaseHistory = () => {
    return JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
  };

  const getRecommendationsByTab = () => {
    switch (activeTab) {
      case 'for_you':
        return recommendations.filter(r => r.reason !== 'popular' && r.reason !== 'new_product');
      case 'popular':
        return recommendations.filter(r => r.reason === 'popular' || (r.sales || 0) > 100);
      case 'new':
        return recommendations.filter(r => r.reason === 'new_product' || isNewProduct(r));
      case 'trending':
        return recommendations.sort((a, b) => (b.sales || 0) - (a.sales || 0));
      default:
        return recommendations;
    }
  };

  const isNewProduct = (item) => {
    if (!item.createdAt) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(item.createdAt) > thirtyDaysAgo;
  };

  const getReasonText = (reason) => {
    const reasons = {
      similar_users: 'あなたと似た嗜好の方が購入',
      same_category: '同じカテゴリの商品',
      similar_price: '似た価格帯の商品',
      high_rated: '高評価商品',
      popular: '人気商品',
      new_product: '新商品',
      frequently_bought_together: 'よく一緒に購入される商品',
      seasonal_trend: '季節のおすすめ',
      popular_addon: '人気のアドオン'
    };
    return reasons[reason] || '推薦商品';
  };

  const tabs = [
    { id: 'for_you', name: 'あなたへのおすすめ', icon: FiHeart },
    { id: 'popular', name: '人気商品', icon: FiTrendingUp },
    { id: 'new', name: '新商品', icon: FiClock },
    { id: 'trending', name: 'トレンド', icon: FiStar }
  ];

  if (loading) {
    return (
      <div className={`py-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-2 text-gray-600">おすすめを読み込み中...</span>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const displayRecommendations = getRecommendationsByTab();

  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {title || 'おすすめ商品'}
          </h2>
          
          {type === 'general' && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-4 h-4" />
                  <span className="text-sm">{tab.name}</span>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayRecommendations.slice(0, 8).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name || item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs">
                    {getReasonText(item.reason)}
                  </span>
                </div>
                {item.reason === 'new_product' && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                      NEW
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.name || item.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-bold text-orange-600">
                    ¥{item.price.toLocaleString()}
                  </div>
                  
                  {item.rating && (
                    <div className="flex items-center">
                      <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/${item.type === 'course' ? 'courses' : 'shop'}/${item.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-center text-sm hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4 mr-1" />
                    詳細
                  </Link>
                  
                  <button
                    onClick={() => addToCart && addToCart({ ...item, type: item.type || 'product' })}
                    className="flex-1 bg-orange-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors flex items-center justify-center"
                  >
                    <SafeIcon icon={FiShoppingCart} className="w-4 h-4 mr-1" />
                    カート
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {displayRecommendations.length > 8 && (
          <div className="text-center mt-8">
            <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              もっと見る
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendationSection;