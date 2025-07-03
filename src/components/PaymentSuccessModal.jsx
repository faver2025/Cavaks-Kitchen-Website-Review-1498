import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiDownload, FiMail } = FiIcons;

const PaymentSuccessModal = ({ isOpen, onClose, paymentDetails, orderInfo }) => {
  if (!isOpen) return null;

  const handleDownloadReceipt = () => {
    // 領収書ダウンロード機能
    alert('領収書をダウンロードします');
  };

  const handleSendEmailReceipt = () => {
    // メール送信機能
    alert('領収書をメールで送信します');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-8"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            決済が完了しました！
          </h2>
          
          <p className="text-gray-600 mb-6">
            ご注文ありがとうございます。決済が正常に処理されました。
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">注文詳細</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>注文番号:</span>
                <span className="font-mono">{paymentDetails?.paymentIntent?.id?.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span>決済金額:</span>
                <span className="font-semibold">¥{orderInfo?.total?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>決済方法:</span>
                <span>クレジットカード</span>
              </div>
              <div className="flex justify-between">
                <span>決済日時:</span>
                <span>{new Date().toLocaleDateString('ja-JP')}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <button
              onClick={handleDownloadReceipt}
              className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4" />
              <span>領収書をダウンロード</span>
            </button>
            
            <button
              onClick={handleSendEmailReceipt}
              className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SafeIcon icon={FiMail} className="w-4 h-4" />
              <span>領収書をメール送信</span>
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            完了
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            確認メールを送信しました。ご確認ください。
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessModal;