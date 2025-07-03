import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiDownload, FiMail, FiPackage, FiTruck, FiStar } = FiIcons;

const PurchaseComplete = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // URLパラメータまたはsessionStorageから注文データを取得
    const orderInfo = JSON.parse(sessionStorage.getItem('completedOrder') || '{}');
    if (!orderInfo.id) {
      // 注文データがない場合はホームにリダイレクト
      navigate('/');
      return;
    }
    
    setOrderData(orderInfo);
    
    // 注文完了メールの送信（模擬）
    sendConfirmationEmail(orderInfo);
    
    // 5分後にsessionStorageをクリア
    setTimeout(() => {
      sessionStorage.removeItem('completedOrder');
    }, 300000);
  }, [navigate]);

  const sendConfirmationEmail = async (orderInfo) => {
    // 実際の実装では、サーバーサイドでメール送信
    console.log('Sending confirmation email for order:', orderInfo.id);
  };

  const downloadReceipt = () => {
    // 領収書ダウンロード機能
    const receiptData = `
      =====================================
      Cavak's Kitchen 領収書
      =====================================
      
      注文番号: ${orderData.orderNumber}
      注文日時: ${new Date(orderData.orderDate).toLocaleString('ja-JP')}
      
      【商品詳細】
      ${orderData.items.map(item => 
        `${item.name} × ${item.quantity} - ¥${(item.price * item.quantity).toLocaleString()}`
      ).join('\n')}
      
      小計: ¥${orderData.subtotal.toLocaleString()}
      送料: ¥${orderData.shipping.toLocaleString()}
      合計: ¥${orderData.total.toLocaleString()}
      
      【お客様情報】
      お名前: ${orderData.customer.name}
      メール: ${orderData.customer.email}
      
      【配送先】
      ${orderData.customer.address}
      
      =====================================
      ありがとうございました。
      Cavak's Kitchen
      =====================================
    `;

    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${orderData.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendEmailReceipt = async () => {
    // メール領収書送信（模擬実装）
    alert('領収書をメールで送信しました。');
  };

  if (!orderData) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">注文情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiCheck} className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ご注文ありがとうございます！
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            決済が正常に完了しました
          </p>
          <p className="text-gray-500">
            注文番号: <span className="font-mono font-semibold">{orderData.orderNumber}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">注文詳細</h2>
              
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.type === 'course' ? 'オンラインコース' : '商品'} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">小計</span>
                    <span>¥{orderData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">送料</span>
                    <span className="text-green-600">無料</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>合計</span>
                    <span className="text-orange-600">¥{orderData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">今後の流れ</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiMail} className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">確認メール送信</h3>
                    <p className="text-sm text-gray-600">
                      ご登録のメールアドレスに注文確認メールを送信いたします。
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiPackage} className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">商品準備</h3>
                    <p className="text-sm text-gray-600">
                      ご注文いただいた商品の準備を開始いたします（1-2営業日）。
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiTruck} className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">発送・配送</h3>
                    <p className="text-sm text-gray-600">
                      商品を発送し、追跡番号をお知らせします（3-5営業日でお届け）。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">アクション</h3>
              
              <div className="space-y-3">
                <button
                  onClick={downloadReceipt}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  <span>領収書をダウンロード</span>
                </button>
                
                <button
                  onClick={sendEmailReceipt}
                  className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiMail} className="w-4 h-4" />
                  <span>領収書をメール送信</span>
                </button>
                
                <Link
                  to={`/order-tracking?id=${orderData.id}`}
                  className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <SafeIcon icon={FiPackage} className="w-4 h-4" />
                  <span>注文を追跡</span>
                </Link>
              </div>
            </motion.div>

            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">お客様情報</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">お名前</p>
                  <p className="font-medium">{orderData.customer.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">メールアドレス</p>
                  <p className="font-medium">{orderData.customer.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">配送先</p>
                  <p className="font-medium">{orderData.customer.address}</p>
                </div>
              </div>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-blue-50 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">サポート</h3>
              <p className="text-sm text-gray-600 mb-4">
                ご不明な点がございましたら、お気軽にお問い合わせください。
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">電話:</span>
                  <span>03-6234-5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">メール:</span>
                  <span>support@cavaks-kitchen.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">営業時間:</span>
                  <span>平日 9:00-18:00</span>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <Link
                to="/dashboard"
                className="w-full block text-center bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                ダッシュボードへ
              </Link>
              
              <Link
                to="/shop"
                className="w-full block text-center border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                買い物を続ける
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Review Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 text-white text-center"
        >
          <SafeIcon icon={FiStar} className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">商品が届いたらレビューをお願いします</h3>
          <p className="mb-4">
            あなたのレビューは他のお客様にとって大変参考になります。
          </p>
          <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            レビューを書く
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PurchaseComplete;