import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../config/stripe';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiCheck } = FiIcons;

const Checkout = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePaymentSuccess = (details) => {
    setPaymentDetails(details);
    setIsPaymentSuccessful(true);

    // 注文データを作成
    const orderData = {
      id: details.paymentIntent.id,
      orderNumber: `#CV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      orderDate: new Date().toISOString(),
      items: cart.map(item => ({
        id: item.id,
        name: item.name || item.title,
        type: item.type,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      subtotal: total,
      shipping: 0,
      total: total,
      customer: details.customerInfo,
      paymentMethod: 'クレジットカード',
      status: '完了'
    };

    // 購入履歴をローカルストレージに保存
    const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
    purchaseHistory.push(orderData);
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));

    // 管理者用注文データも保存
    const adminOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const adminOrder = {
      id: details.paymentIntent.id,
      customer: details.customerInfo.name,
      email: details.customerInfo.email,
      items: orderData.items,
      total: total,
      status: 'pending',
      paymentStatus: 'paid',
      shippingStatus: 'preparing',
      orderDate: new Date().toISOString(),
      shippingAddress: `${details.customerInfo.address.line1}, ${details.customerInfo.address.city}`
    };
    adminOrders.push(adminOrder);
    localStorage.setItem('adminOrders', JSON.stringify(adminOrders));

    // 注文完了ページ用データをsessionStorageに保存
    sessionStorage.setItem('completedOrder', JSON.stringify(orderData));

    // カートをクリア
    clearCart();

    // 3秒後に購入完了ページにリダイレクト
    setTimeout(() => {
      navigate('/purchase-complete');
    }, 3000);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };

  if (cart.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">カートが空です</h1>
          <button
            onClick={() => navigate('/shop')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            ショップに戻る
          </button>
        </div>
      </div>
    );
  }

  if (isPaymentSuccessful) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            決済が完了しました！
          </h2>
          <p className="text-gray-600 mb-6">
            ご注文ありがとうございます。確認メールをお送りしました。
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>注文番号:</span>
                <span className="font-mono">{paymentDetails?.paymentIntent.id.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span>決済金額:</span>
                <span className="font-semibold">¥{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>決済方法:</span>
                <span>クレジットカード</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            3秒後に注文完了ページに移動します...
          </p>
        </motion.div>
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
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center text-orange-600 hover:text-orange-700 mr-4"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5 mr-1" />
              カートに戻る
            </button>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">チェックアウト</h1>
          <p className="text-xl text-gray-600">
            ご注文内容を確認して決済を完了してください
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 注文サマリー */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">注文サマリー</h3>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.type}`} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name || item.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {item.name || item.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {item.type === 'course' ? 'オンラインコース' : '商品'}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-600">
                        数量: {item.quantity}
                      </span>
                      <span className="font-semibold text-orange-600">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>小計</span>
                  <span>¥{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>送料</span>
                  <span className="text-green-600">無料</span>
                </div>
                <div className="flex justify-between">
                  <span>税込</span>
                  <span>¥0</span>
                </div>
              </div>
              <div className="border-t pt-2 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">合計</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ¥{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 決済フォーム */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Elements stripe={stripePromise}>
              <PaymentForm
                cart={cart}
                total={total}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </Elements>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;