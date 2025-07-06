import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, stripeService } from '../config/stripe';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLock, FiCreditCard, FiCheck, FiShield } = FiIcons;

const CheckoutForm = ({ cart, total, customerInfo, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // Stripeが利用できない場合はデモモードに
    if (!stripe) {
      setDemoMode(true);
    }
  }, [stripe]);

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
    hidePostalCode: false,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setProcessing(true);
    setError(null);

    try {
      if (demoMode) {
        // デモモード: 決済をシミュレート
        console.log('デモモード: 決済処理をシミュレート中...');
        
        // 決済処理の遅延をシミュレート
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // モック PaymentIntent
        const mockPaymentIntent = {
          id: `pi_demo_${Date.now()}`,
          amount: total * 100,
          currency: 'jpy',
          status: 'succeeded'
        };

        // 成功をシミュレート
        setSucceeded(true);
        
        const order = await stripeService.handlePaymentSuccess(
          mockPaymentIntent,
          {
            customer: customerInfo,
            items: cart,
            total: total
          }
        );

        if (onSuccess) onSuccess({
          paymentIntent: mockPaymentIntent,
          order: order,
          customerInfo: customerInfo
        });
        
      } else {
        // 実際のStripe処理
        if (!stripe || !elements) {
          throw new Error('Stripeが初期化されていません');
        }

        const cardElement = elements.getElement(CardElement);

        // PaymentIntentを作成
        const paymentIntent = await stripeService.createPaymentIntent(
          total * 100, // Stripeは金額をセント単位で扱う
          'jpy',
          {
            customer_name: customerInfo.name,
            customer_email: customerInfo.email,
            order_items: JSON.stringify(cart.map(item => ({
              id: item.id,
              name: item.name || item.title,
              quantity: item.quantity,
              price: item.price
            })))
          }
        );

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
          setError(error.message);
          if (onError) onError(error);
        } else if (confirmedPaymentIntent.status === 'succeeded') {
          setSucceeded(true);
          
          // 注文を処理
          const order = await stripeService.handlePaymentSuccess(
            confirmedPaymentIntent,
            {
              customer: customerInfo,
              items: cart,
              total: total
            }
          );

          if (onSuccess) onSuccess({
            paymentIntent: confirmedPaymentIntent,
            order: order,
            customerInfo: customerInfo
          });
        }
      }
    } catch (err) {
      setError('決済処理中にエラーが発生しました: ' + err.message);
      if (onError) onError(err);
    } finally {
      setProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          決済が完了しました！
        </h3>
        <p className="text-gray-600">
          ご注文ありがとうございます。確認メールを送信いたします。
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <SafeIcon icon={FiLock} className="w-5 h-5 text-green-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-900">
          安全な決済 {demoMode && '(デモモード)'}
        </h3>
      </div>

      {demoMode && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-600">
            🎯 <strong>デモモード:</strong> 実際の決済は行われません。テスト用のカード情報を入力してください。
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* カード情報 */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center">
            <SafeIcon icon={FiCreditCard} className="w-5 h-5 mr-2" />
            クレジットカード情報
          </h4>
          
          {demoMode ? (
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">テスト用カード情報:</div>
                <div className="space-y-2 text-sm">
                  <div>カード番号: 4242 4242 4242 4242</div>
                  <div>有効期限: 12/25</div>
                  <div>CVC: 123</div>
                </div>
              </div>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                defaultValue="4242 4242 4242 4242"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="px-4 py-3 border border-gray-300 rounded-lg"
                  defaultValue="12/25"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="px-4 py-3 border border-gray-300 rounded-lg"
                  defaultValue="123"
                />
              </div>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4">
              <CardElement options={cardElementOptions} />
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <div className="flex items-center">
              <SafeIcon icon={FiShield} className="w-4 h-4 mr-1" />
              お客様のカード情報は安全に暗号化されて送信されます
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
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
          disabled={processing}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            processing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-700'
          } text-white flex items-center justify-center`}
        >
          {processing ? (
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
          <span>{demoMode ? 'デモ決済' : 'Stripe決済'}</span>
          <span>•</span>
          <span>安全な取引</span>
        </div>
      </div>
    </motion.div>
  );
};

const StripeCheckout = ({ cart, total, customerInfo, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        cart={cart}
        total={total}
        customerInfo={customerInfo}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripeCheckout;