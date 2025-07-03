// 決済関連のAPI関数（実際の本番環境ではサーバーサイドで実装）

// PaymentIntentを作成する関数
export const createPaymentIntent = async ({ amount, currency = 'jpy', customer_info, cart_items }) => {
  try {
    // 実際の本番環境では、サーバーサイドAPIを呼び出す
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        customer_info: customer_info,
        cart_items: cart_items,
        metadata: {
          order_id: `order_${Date.now()}`,
          customer_name: customer_info.name,
          customer_email: customer_info.email
        }
      })
    });

    if (!response.ok) {
      throw new Error('PaymentIntent作成に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('PaymentIntent作成エラー:', error);
    throw error;
  }
};

// 決済完了後の処理
export const handlePaymentSuccess = async (paymentIntent, customerInfo, cartItems) => {
  try {
    // 注文情報をサーバーに送信
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_intent_id: paymentIntent.id,
        customer_info: customerInfo,
        items: cartItems,
        total_amount: paymentIntent.amount / 100, // Stripeは金額をセント単位で扱う
        status: 'completed',
        created_at: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('注文処理に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('注文処理エラー:', error);
    throw error;
  }
};

// 領収書を生成する関数
export const generateReceipt = async (orderId) => {
  try {
    const response = await fetch(`/api/receipts/${orderId}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('領収書生成に失敗しました');
    }

    // PDFファイルをダウンロード
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('領収書ダウンロードエラー:', error);
    throw error;
  }
};

// 返金処理
export const requestRefund = async (paymentIntentId, amount, reason) => {
  try {
    const response = await fetch('/api/refunds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_intent_id: paymentIntentId,
        amount: amount,
        reason: reason
      })
    });

    if (!response.ok) {
      throw new Error('返金処理に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('返金処理エラー:', error);
    throw error;
  }
};

// 模擬的なサーバーサイドAPI（開発環境用）
export const mockCreatePaymentIntent = (amount, currency = 'jpy') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `pi_mock_${Date.now()}`,
        client_secret: `pi_mock_${Date.now()}_secret_abc123`,
        amount: amount,
        currency: currency,
        status: 'requires_payment_method'
      });
    }, 1000);
  });
};