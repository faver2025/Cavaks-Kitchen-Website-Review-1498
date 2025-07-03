import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiTruck, FiShield, FiRefreshCw, FiPlay } = FiIcons;

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // 管理者が作成した商品から詳細を取得
    const savedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const foundProduct = savedProducts.find(p => p.id === parseInt(id));
    
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // フォールバック用のモックデータ
      setProduct({
        id: parseInt(id),
        name: 'プロ仕様包丁セット',
        price: 28000,
        rating: 4.9,
        reviews: 156,
        images: [
          'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'プロの料理人が使用する高品質な包丁セットです。切れ味抜群で、長時間の使用でも疲れにくい設計になっています。',
        features: [
          '高品質ステンレス鋼使用',
          '人間工学に基づいたハンドル設計',
          '3本セット（三徳包丁、ペティナイフ、パン切り包丁）',
          '専用ケース付き',
          '1年間保証'
        ],
        specifications: {
          '材質': 'ステンレス鋼',
          '重量': '約1.2kg',
          'サイズ': '三徳包丁: 18cm, ペティナイフ: 12cm, パン切り包丁: 20cm',
          '原産国': '日本'
        }
      });
    }
  }, [id]);

  if (!product) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">商品情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  const productImages = product.images || [product.image];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <img 
                src={productImages[selectedImage]} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
              />
              
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {productImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      className={`w-full h-20 object-cover rounded-lg cursor-pointer ${
                        selectedImage === index ? 'ring-2 ring-orange-600' : ''
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* Product Videos */}
              {product.videos && product.videos.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">商品動画</h4>
                  <div className="space-y-3">
                    {product.videos.map((videoUrl, index) => {
                      if (!videoUrl) return null;
                      
                      // YouTube URL処理
                      const getYouTubeEmbedUrl = (url) => {
                        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
                        return match ? `https://www.youtube.com/embed/${match[1]}` : url;
                      };
                      
                      return (
                        <div key={index} className="relative">
                          <iframe
                            src={getYouTubeEmbedUrl(videoUrl)}
                            className="w-full h-48 rounded-lg"
                            allowFullScreen
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <SafeIcon icon={FiStar} className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="font-medium">{product.rating || 4.5}</span>
                </div>
                <span className="text-gray-500">({product.reviews || 0}件のレビュー)</span>
              </div>
              
              <div className="text-3xl font-bold text-red-600 mb-6">
                ¥{product.price.toLocaleString()}
              </div>
              
              <p className="text-lg text-gray-700 mb-6">{product.description}</p>
            </div>

            {product.features && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">商品特徴</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.specifications && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">商品仕様</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dl className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex">
                        <dt className="w-24 text-gray-600">{key}:</dt>
                        <dd className="flex-1">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">数量:</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => addToCart({ ...product, type: 'product', quantity })}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  カートに追加 - ¥{(product.price * quantity).toLocaleString()}
                </button>
                
                <button className="w-full border border-red-600 text-red-600 py-3 rounded-lg hover:bg-red-50 transition-colors font-semibold">
                  今すぐ購入
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <SafeIcon icon={FiTruck} className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">送料無料</p>
              </div>
              <div className="text-center">
                <SafeIcon icon={FiShield} className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">1年保証</p>
              </div>
              <div className="text-center">
                <SafeIcon icon={FiRefreshCw} className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">30日返品可能</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;