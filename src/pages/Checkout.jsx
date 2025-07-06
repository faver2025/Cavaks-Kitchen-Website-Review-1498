import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StripeCheckout from '../components/StripeCheckout';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiUser, FiMail, FiMapPin } = FiIcons;

const Checkout = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      postal_code: '',
      country: 'JP'
    }
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setCustomerInfo(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setCustomerInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePaymentSuccess = (result) => {
    // 注文データを作成
    const orderData = {
      id: result.paymentIntent.id,
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
      customer: customerInfo,
      paymentMethod: 'クレジットカード',
      status: '完了',
      paymentIntent: result.paymentIntent
    };

    // 購入履歴をローカルストレージに保存
    const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
    purchaseHistory.push(orderData);
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));

    // 管理者用注文データも保存
    const adminOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const adminOrder = {
      id: result.paymentIntent.id,
      customer: customerInfo.name,
      email: customerInfo.email,
      items: orderData.items,
      total: total,
      status: 'pending',
      paymentStatus: 'paid',
      shippingStatus: 'preparing',
      orderDate: new Date().toISOString(),
      shippingAddress: `${customerInfo.address.line1}, ${customerInfo.address.city}`
    };
    adminOrders.push(adminOrder);
    localStorage.setItem('adminOrders', JSON.stringify(adminOrders));

    // 注文完了ページ用データをsessionStorageに保存
    sessionStorage.setItem('completedOrder', JSON.stringify(orderData));

    // カートをクリア
    clearCart();

    // 購入完了ページにリダイレクト
    navigate('/purchase-complete');
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert('決済に失敗しました: ' + error.message);
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

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          {/* 顧客情報入力フォーム */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <SafeIcon icon={FiUser} className="w-5 h-5 mr-2" />
              お客様情報
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    お名前 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleCustomerInfoChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="山田太郎"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  住所 *
                </label>
                <input
                  type="text"
                  name="address.line1"
                  value={customerInfo.address.line1}
                  onChange={handleCustomerInfoChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="東京都港区青山1-2-3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    市区町村 *
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={customerInfo.address.city}
                    onChange={handleCustomerInfoChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="港区"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    郵便番号 *
                  </label>
                  <input
                    type="text"
                    name="address.postal_code"
                    value={customerInfo.address.postal_code}
                    onChange={handleCustomerInfoChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="107-0061"
                  />
                </div>
              </div>
            </div>

            {/* 注文サマリー */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">注文サマリー</h4>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.type}`} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name || item.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-gray-900">
                        {item.name || item.title}
                      </h5>
                      <p className="text-xs text-gray-600">
                        {item.type === 'course' ? 'オンラインコース' : '商品'} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-orange-600">
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">合計</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ¥{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stripe決済フォーム */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <StripeCheckout
              cart={cart}
              total={total}
              customerInfo={customerInfo}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;