import { loadStripe } from '@stripe/stripe-js';

// Stripe公開可能キー（実際の本番環境では環境変数を使用）
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51234567890abcdef...'; // ここに実際のStripe公開可能キーを設定

// Stripeインスタンスを初期化
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

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