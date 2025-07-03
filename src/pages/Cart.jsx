import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrash2, FiPlus, FiMinus, FiShoppingCart } = FiIcons;

const Cart = ({ cart, updateCartQuantity, removeFromCart }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiShoppingCart} className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">カート</h1>
            <p className="text-xl text-gray-600 mb-8">カートは空です</p>
            <div className="flex space-x-4 justify-center">
              <Link
                to="/courses"
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                コースを見る
              </Link>
              <Link
                to="/shop"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                ショップを見る
              </Link>
            </div>
          </div>
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
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">カート</h1>
          <p className="text-xl text-gray-600">
            {cart.length}個の商品があります
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <motion.div
                key={`${item.id}-${item.type}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name || item.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.name || item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.type === 'course' ? 'オンラインコース' : '商品'}
                    </p>
                    <p className="text-lg font-bold text-red-600">
                      ¥{item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.type, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <SafeIcon icon={FiMinus} className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.type, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.type)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">注文サマリー</h3>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.type}`} className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {item.name || item.title} × {item.quantity}
                    </span>
                    <span className="text-sm font-medium">
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>小計</span>
                    <span>¥{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>送料</span>
                    <span className="text-green-600">無料</span>
                  </div>
                </div>
                
                <div className="border-t pt-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">合計</span>
                    <span className="text-2xl font-bold text-red-600">
                      ¥{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold text-center block"
              >
                決済に進む
              </Link>

              <div className="mt-4 text-center">
                <Link
                  to="/courses"
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  買い物を続ける
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;