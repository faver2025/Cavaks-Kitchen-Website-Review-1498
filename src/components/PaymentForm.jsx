import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLock, FiCreditCard, FiCheck } = FiIcons;

const PaymentForm = ({ cart, total, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
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

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: '"Noto Sans JP", sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // クライアント側でPaymentIntentを作成（実際の本番環境ではサーバー側で作成）
      const paymentIntent = await createPaymentIntent();

      // 決済を確認
      const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
              address: customerInfo.address
            }
          }
        }
      );

      if (error) {
        setPaymentError(error.message);
        onPaymentError(error);
      } else if (confirmedPaymentIntent.status === 'succeeded') {
        // 決済成功
        onPaymentSuccess({
          paymentIntent: confirmedPaymentIntent,
          customerInfo,
          cart,
          total
        });
      }
    } catch (err) {
      setPaymentError('決済処理中にエラーが発生しました');
      onPaymentError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // PaymentIntentを作成（模擬実装）
  const createPaymentIntent = async () => {
    // 実際の本番環境では、サーバーサイドAPIを呼び出す
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: total,
        currency: 'jpy',
        customer_info: customerInfo,
        cart_items: cart
      })
    });

    if (!response.ok) {
      throw new Error('PaymentIntent作成に失敗しました');
    }

    return await response.json();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <SafeIcon icon={FiLock} className="w-5 h-5 text-green-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-900">安全な決済</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 顧客情報 */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">お客様情報</h4>
          
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

        {/* カード情報 */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center">
            <SafeIcon icon={FiCreditCard} className="w-5 h-5 mr-2" />
            クレジットカード情報
          </h4>
          
          <div className="border border-gray-300 rounded-lg p-4">
            <CardElement options={cardElementOptions} />
          </div>
          
          <div className="text-sm text-gray-600">
            <div className="flex items-center">
              <SafeIcon icon={FiLock} className="w-4 h-4 mr-1" />
              お客様のカード情報は安全に暗号化されて送信されます
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{paymentError}</p>
          </div>
        )}

        {/* 注文サマリー */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">注文内容</h4>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={`${item.id}-${item.type}`} className="flex justify-between text-sm">
                <span>{item.name || item.title} × {item.quantity}</span>
                <span>¥{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 mt-3">
            <div className="flex justify-between font-semibold">
              <span>合計</span>
              <span className="text-orange-600">¥{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 決済ボタン */}
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-700'
          } text-white flex items-center justify-center`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              決済処理中...
            </>
          ) : (
            <>
              <SafeIcon icon={FiCheck} className="w-5 h-5 mr-2" />
              ¥{total.toLocaleString()}を決済する
            </>
          )}
        </button>
      </form>

      {/* セキュリティ情報 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <SafeIcon icon={FiLock} className="w-4 h-4 mr-1" />
            SSL暗号化
          </div>
          <span>•</span>
          <span>Stripe決済</span>
          <span>•</span>
          <span>安全な取引</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentForm;