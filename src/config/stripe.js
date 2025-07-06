import { loadStripe } from '@stripe/stripe-js';

// デモ用の公開キー（実際の本番環境では環境変数を使用）
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51234567890abcdef...'; // デモモードでは無効なキーでもOK

// Stripeインスタンスを初期化（デモモードでは null でも動作）
export const stripePromise = STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_') ? 
  loadStripe(STRIPE_PUBLISHABLE_KEY) : 
  Promise.resolve(null);

// 決済設定
export const STRIPE_CONFIG = {
  currency: 'jpy',
  country: 'JP',
  locale: 'ja'
};

// 商品タイプごとの設定
export const PRODUCT_TYPES = {
  COURSE: 'course',
  PRODUCT: 'product'
};

// Stripe決済処理関数
export const stripeService = {
  // PaymentIntentを作成
  async createPaymentIntent(amount, currency = 'jpy', metadata = {}) {
    try {
      console.log('デモ: PaymentIntentを作成中...', { amount, currency, metadata });
      
      // デモモード: モックPaymentIntentを返す
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        id: `pi_demo_${Date.now()}`,
        client_secret: `pi_demo_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
        currency: currency,
        status: 'requires_payment_method',
        metadata: metadata
      };
    } catch (error) {
      console.error('PaymentIntent作成エラー:', error);
      throw new Error('決済の準備に失敗しました');
    }
  },

  // 決済完了後の処理
  async handlePaymentSuccess(paymentIntent, orderData) {
    try {
      console.log('デモ: 注文を処理中...', { paymentIntent, orderData });
      
      // デモモード: ローカルストレージに保存
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrder = {
        id: paymentIntent.id,
        payment_intent_id: paymentIntent.id,
        customer_info: orderData.customer,
        items: orderData.items,
        total_amount: paymentIntent.amount,
        status: 'completed',
        created_at: new Date().toISOString()
      };

      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newOrder;
    } catch (error) {
      console.error('注文処理エラー:', error);
      throw new Error('注文の処理に失敗しました');
    }
  },

  // 返金処理
  async createRefund(paymentIntentId, amount, reason = '') {
    try {
      console.log('デモ: 返金処理中...', { paymentIntentId, amount, reason });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        id: `re_demo_${Date.now()}`,
        payment_intent: paymentIntentId,
        amount: amount,
        reason: reason,
        status: 'succeeded'
      };
    } catch (error) {
      console.error('返金処理エラー:', error);
      throw error;
    }
  }
};