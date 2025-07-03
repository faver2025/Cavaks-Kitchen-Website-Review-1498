import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPackage, FiTruck, FiCheck, FiClock, FiMapPin, FiPhone, FiMail } = FiIcons;

const OrderTracking = () => {
  const [orderData, setOrderData] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    // URLパラメータから注文IDを取得（実装例）
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    if (orderId) {
      loadOrderData(orderId);
    }
  }, []);

  const loadOrderData = (orderId) => {
    // 実際の実装では APIから注文データを取得
    const mockOrderData = {
      id: orderId || 'ord_1234567890',
      orderNumber: '#CV-2024-001234',
      status: 'shipped',
      orderDate: '2024-01-15T10:30:00Z',
      estimatedDelivery: '2024-01-18',
      trackingNumber: 'CV789012345JP',
      customer: {
        name: '山田太郎',
        email: 'yamada@example.com',
        phone: '090-1234-5678',
        address: '〒107-0061 東京都港区青山1-2-3 青山マンション 101号室'
      },
      items: [
        {
          id: 1,
          name: 'プロ仕様包丁セット',
          quantity: 1,
          price: 28000,
          image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 2,
          name: '高級オリーブオイル',
          quantity: 2,
          price: 3800,
          image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        }
      ],
      shipping: {
        method: 'ヤマト運輸 宅急便',
        fee: 0,
        address: '〒107-0061 東京都港区青山1-2-3 青山マンション 101号室'
      },
      payment: {
        method: 'クレジットカード',
        status: 'completed',
        amount: 35600
      },
      trackingHistory: [
        {
          date: '2024-01-15T10:30:00Z',
          status: 'ordered',
          description: 'ご注文を承りました',
          location: 'Cavak\'s Kitchen'
        },
        {
          date: '2024-01-15T14:20:00Z',
          status: 'confirmed',
          description: '注文確認・決済完了',
          location: 'Cavak\'s Kitchen'
        },
        {
          date: '2024-01-16T09:15:00Z',
          status: 'preparing',
          description: '商品準備中',
          location: '東京配送センター'
        },
        {
          date: '2024-01-16T16:45:00Z',
          status: 'shipped',
          description: '発送完了',
          location: '東京配送センター'
        },
        {
          date: '2024-01-17T08:30:00Z',
          status: 'in_transit',
          description: '配送中',
          location: '港区配送センター'
        }
      ]
    };

    setOrderData(mockOrderData);
    setTrackingNumber(mockOrderData.trackingNumber);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ordered':
      case 'confirmed':
        return FiCheck;
      case 'preparing':
        return FiPackage;
      case 'shipped':
      case 'in_transit':
        return FiTruck;
      case 'delivered':
        return FiCheck;
      default:
        return FiClock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ordered':
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'preparing':
        return 'text-yellow-600 bg-yellow-100';
      case 'shipped':
      case 'in_transit':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      ordered: '注文受付',
      confirmed: '注文確認',
      preparing: '準備中',
      shipped: '発送済み',
      in_transit: '配送中',
      delivered: '配達完了'
    };
    return statusMap[status] || status;
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
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">注文追跡</h1>
          <p className="text-gray-600">注文番号: {orderData.orderNumber}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tracking Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">配送状況</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}>
                  {getStatusText(orderData.status)}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-2">
                  <SafeIcon icon={FiTruck} className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">追跡番号</p>
                    <p className="text-gray-600 font-mono">{orderData.trackingNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <SafeIcon icon={FiClock} className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">配達予定日</p>
                    <p className="text-gray-600">{new Date(orderData.estimatedDelivery).toLocaleDateString('ja-JP')}</p>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">配送履歴</h3>
                <div className="relative">
                  {orderData.trackingHistory.map((event, index) => (
                    <div key={index} className="relative flex items-start space-x-4 pb-4">
                      {/* Timeline line */}
                      {index < orderData.trackingHistory.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200"></div>
                      )}
                      
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(event.status)}`}>
                        <SafeIcon icon={getStatusIcon(event.status)} className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{event.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString('ja-JP', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">注文商品</h3>
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">数量: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">合計</span>
                  <span className="text-xl font-bold text-orange-600">
                    ¥{orderData.payment.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">お客様情報</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{orderData.customer.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 text-sm">{orderData.customer.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 text-sm">{orderData.customer.phone}</span>
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">配送先</h3>
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-900 font-medium">{orderData.customer.name}</p>
                  <p className="text-gray-600 text-sm">{orderData.customer.address}</p>
                </div>
              </div>
            </motion.div>

            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">決済情報</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">決済方法</span>
                  <span className="text-gray-900">{orderData.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">決済状況</span>
                  <span className="text-green-600">決済完了</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">送料</span>
                  <span className="text-gray-900">無料</span>
                </div>
              </div>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-orange-50 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">サポート</h3>
              <p className="text-sm text-gray-600 mb-4">
                配送に関するご質問やお困りのことがございましたら、お気軽にお問い合わせください。
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiPhone} className="w-4 h-4 text-orange-600" />
                  <span>03-6234-5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiMail} className="w-4 h-4 text-orange-600" />
                  <span>support@cavaks-kitchen.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiClock} className="w-4 h-4 text-orange-600" />
                  <span>平日 9:00-18:00</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;