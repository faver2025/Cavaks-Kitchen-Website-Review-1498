import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAward, FiUsers, FiTrendingUp, FiHeart } = FiIcons;

const About = () => {
  const achievements = [
    {
      icon: FiAward,
      title: '業界No.1の実績',
      description: '10,000人以上の受講生が満足',
      color: 'text-yellow-600'
    },
    {
      icon: FiUsers,
      title: 'プロ講師陣',
      description: '一流レストラン出身の講師が指導',
      color: 'text-blue-600'
    },
    {
      icon: FiTrendingUp,
      title: '継続的な成長',
      description: '受講生の98%がスキルアップを実感',
      color: 'text-green-600'
    },
    {
      icon: FiHeart,
      title: '料理への愛',
      description: '料理を通じて人生を豊かに',
      color: 'text-red-600'
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <img 
              src="https://cavaks-kitchen.com/wp-content/uploads/2024/01/logo-1.png" 
              alt="Cavak's Kitchen"
              className="h-16 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <h1 className="text-4xl font-bold text-gray-900" style={{ display: 'none' }}>
              Cavak's Kitchen
            </h1>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            料理を通じて人生を豊かにする総合プラットフォーム
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              私たちのミッション
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Cavak's Kitchenは、料理の学習から実践まで、すべてをサポートする総合プラットフォームです。
              プロの料理人から学べるオンラインコースと、厳選された料理器具・食材を提供しています。
            </p>
            <p className="text-lg text-gray-600 mb-6">
              私たちは、料理を通じて人々の生活をより豊かにし、食の楽しさを伝えることを使命としています。
              初心者からプロまで、すべての人が料理を楽しめる環境を提供します。
            </p>
            <p className="text-lg text-gray-600">
              東京・青山に拠点を置き、日本全国そして世界中の料理愛好家に最高の学習体験をお届けしています。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-96 bg-cover bg-center rounded-lg shadow-lg"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)'
            }}
          ></motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            私たちの実績
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div 
                key={achievement.title}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg`}>
                  <SafeIcon icon={achievement.icon} className={`w-8 h-8 ${achievement.color}`} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h4>
                <p className="text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gray-50 rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            会社概要
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">会社名</h4>
                <p className="text-gray-600">株式会社 Cavak's Kitchen</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">設立</h4>
                <p className="text-gray-600">2020年4月</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">資本金</h4>
                <p className="text-gray-600">1億円</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">従業員数</h4>
                <p className="text-gray-600">150名</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">本社所在地</h4>
                <p className="text-gray-600">
                  〒107-0061<br />
                  東京都港区青山1-2-3 青山ビル5F
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">事業内容</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>・オンライン料理教室の運営</li>
                  <li>・料理器具・食材のECサイト運営</li>
                  <li>・料理関連コンテンツの制作・配信</li>
                  <li>・企業向け料理研修サービス</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            なぜCavak's Kitchenを選ぶのか
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">プロの指導</h4>
              <p className="text-gray-600">経験豊富なプロの料理人から直接学べます</p>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">高品質な商品</h4>
              <p className="text-gray-600">厳選された料理器具と食材を提供します</p>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">充実サポート</h4>
              <p className="text-gray-600">学習から実践まで包括的にサポートします</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;